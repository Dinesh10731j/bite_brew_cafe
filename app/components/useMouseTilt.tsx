'use client'

import { useEffect, useCallback, useRef, RefObject } from 'react'
import { gsap } from '../lib/gsap'

interface UseMouseTiltProps {
  ref: RefObject<HTMLElement | null>
  glareRef?: RefObject<HTMLElement | null>
  sensitivity?: number
  maxRotation?: number
  scale?: number
}

export const useMouseTilt = ({
  ref,
  glareRef,
  sensitivity = 25,
  maxRotation = 18,
  scale = 1.05
}: UseMouseTiltProps) => {
  const bounds = useRef<DOMRect | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (!ref.current) return

    bounds.current = ref.current.getBoundingClientRect()

    gsap.to(ref.current, {
      scale,
      duration: 0.4,
      ease: 'power2.out'
    })
  }, [ref, scale])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || !bounds.current) return

    const { clientX, clientY } = e
    const rect = bounds.current

    const x = (clientX - (rect.left + rect.width / 2)) / sensitivity
    const y = (clientY - (rect.top + rect.height / 2)) / sensitivity

    const rotateY = Math.max(-maxRotation, Math.min(maxRotation, x))
    const rotateX = Math.max(-maxRotation, Math.min(maxRotation, -y))

    gsap.to(ref.current, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      transformOrigin: 'center',
      duration: 0.5,
      ease: 'power3.out'
    })

    // 💡 Glare effect
    if (glareRef?.current) {
      const glareX = ((clientX - rect.left) / rect.width) * 100
      const glareY = ((clientY - rect.top) / rect.height) * 100

      gsap.to(glareRef.current, {
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35), transparent 60%)`,
        duration: 0.3
      })
    }

  }, [ref, glareRef, sensitivity, maxRotation])

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return

    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out'
    })

    if (glareRef?.current) {
      gsap.to(glareRef.current, {
        background: 'transparent',
        duration: 0.4
      })
    }
  }, [ref, glareRef])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter)
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseEnter, handleMouseMove, handleMouseLeave, ref])
}