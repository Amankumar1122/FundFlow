package com.fundflow.exception;

import java.time.Instant;
import java.util.Map;
import java.util.TreeMap;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
   @ExceptionHandler({MethodArgumentNotValidException.class})
   public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException exception) {
      Map<String, String> fields = new TreeMap();
      exception.getBindingResult().getFieldErrors().forEach((error) -> fields.putIfAbsent(error.getField(), error.getDefaultMessage()));
      return ResponseEntity.badRequest().body(new ApiError("Request validation failed", fields, Instant.now()));
   }

   @ExceptionHandler({ResourceNotFoundException.class})
   public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException exception) {
      return this.error(HttpStatus.NOT_FOUND, exception.getMessage());
   }

   @ExceptionHandler({ConflictException.class})
   public ResponseEntity<ApiError> handleConflict(ConflictException exception) {
      return this.error(HttpStatus.CONFLICT, exception.getMessage());
   }

   @ExceptionHandler({DataIntegrityViolationException.class})
   public ResponseEntity<ApiError> handleDataConflict(DataIntegrityViolationException exception) {
      return this.error(HttpStatus.CONFLICT, "The request conflicts with existing data");
   }

   @ExceptionHandler({AccessDeniedException.class})
   public ResponseEntity<ApiError> handleForbidden(AccessDeniedException exception) {
      return this.error(HttpStatus.FORBIDDEN, "You are not allowed to perform this action");
   }

   @ExceptionHandler({BadCredentialsException.class})
   public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException exception) {
      return this.error(HttpStatus.UNAUTHORIZED, "Invalid email or password");
   }

   @ExceptionHandler({IllegalArgumentException.class})
   public ResponseEntity<ApiError> handleInvalidArgument(IllegalArgumentException exception) {
      return this.error(HttpStatus.BAD_REQUEST, exception.getMessage());
   }

   @ExceptionHandler({Exception.class})
   public ResponseEntity<ApiError> handleUnexpected(Exception exception) {
      return this.error(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected server error occurred");
   }

   private ResponseEntity<ApiError> error(HttpStatus status, String message) {
      return ResponseEntity.status(status).body(new ApiError(message, Map.of(), Instant.now()));
   }

   public static record ApiError(String message, Map<String, String> fieldErrors, Instant timestamp) {
   }
}
