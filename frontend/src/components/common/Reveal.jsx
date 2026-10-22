import { useEffect, useRef, useState } from 'react'

export function useInView(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsVisible(true)
      observer.unobserve(element)
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px', ...options })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}

export default function Reveal({ children, className = '', delay = 0, as: Element = 'div' }) {
  const [ref, isVisible] = useInView()
  return (
    <Element ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>
      {children}
    </Element>
  )
}
