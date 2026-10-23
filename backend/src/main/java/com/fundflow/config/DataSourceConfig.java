package com.fundflow.config;

import com.zaxxer.hikari.HikariDataSource;
import java.net.URI;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

@Configuration
public class DataSourceConfig {
    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(Environment env) {
        String rawUrl = getFirstNonEmpty(env, "DB_URL", "DATABASE_URL", "DATABASE_URL_UNPOOLED");

        String username = env.getProperty("DB_USERNAME");
        String password = env.getProperty("DB_PASSWORD");

        if (rawUrl != null) {
            rawUrl = cleanString(rawUrl);
        }

        String jdbcUrl;

        if (rawUrl == null || rawUrl.isBlank()) {
            jdbcUrl = "jdbc:postgresql://localhost:5432/fundflow";
            if (username == null) username = "postgres";
            if (password == null) password = "";
        } else if (rawUrl.startsWith("jdbc:")) {
            jdbcUrl = rawUrl;
            if (username == null) username = env.getProperty("DB_USERNAME", "postgres");
            if (password == null) password = env.getProperty("DB_PASSWORD", "");
        } else if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
            try {
                String normalizedUri = rawUrl;
                if (normalizedUri.startsWith("postgres://")) {
                    normalizedUri = "postgresql://" + normalizedUri.substring("postgres://".length());
                }
                URI uri = new URI(normalizedUri);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && (username == null || username.isBlank() || "postgres".equals(username))) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    if (parts.length > 1 && (password == null || password.isBlank())) {
                        password = parts[1];
                    }
                }
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String host = uri.getHost();
                String path = uri.getPath();
                String query = uri.getQuery();

                StringBuilder sb = new StringBuilder("jdbc:postgresql://").append(host).append(":").append(port).append(path);
                if (query != null && !query.isBlank()) {
                    sb.append("?").append(query);
                } else {
                    sb.append("?sslmode=require");
                }
                jdbcUrl = sb.toString();
            } catch (Exception e) {
                log.warn("Failed to parse DATABASE_URL as URI, fallback to direct jdbc prefix: {}", e.getMessage());
                jdbcUrl = "jdbc:" + rawUrl;
            }
        } else {
            jdbcUrl = "jdbc:postgresql://" + rawUrl;
        }

        if (username != null) username = cleanString(username);
        if (password != null) password = cleanString(password);

        log.info("Configuring DataSource with JDBC URL: {}", maskUrl(jdbcUrl));

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(jdbcUrl);
        if (username != null && !username.isBlank()) {
            ds.setUsername(username);
        }
        if (password != null) {
            ds.setPassword(password);
        }
        ds.setDriverClassName("org.postgresql.Driver");
        ds.setMaxLifetime(600000L); // 10 minutes
        ds.setIdleTimeout(300000L);  // 5 minutes
        ds.setConnectionTimeout(30000L); // 30s
        ds.setMinimumIdle(1);
        ds.setMaximumPoolSize(10);
        return ds;
    }

    private static String getFirstNonEmpty(Environment env, String... keys) {
        for (String key : keys) {
            String val = env.getProperty(key);
            if (val != null && !val.trim().isEmpty()) {
                return val.trim();
            }
        }
        return null;
    }

    private static String cleanString(String val) {
        if (val == null) return null;
        val = val.trim();
        if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
            return val.substring(1, val.length() - 1).trim();
        }
        return val;
    }

    private static String maskUrl(String url) {
        if (url == null) return "";
        return url.replaceAll(":[^/@:]+@", ":****@");
    }
}
