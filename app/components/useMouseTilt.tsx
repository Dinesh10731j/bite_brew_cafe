'use client'

import { useEffect, useCallback, useRef, RefObject } from 'react'
import { gsap } from '../lib/gsap'

interface UseMouseTiltProps {
  ref: RefObject<HTMLElement | null>
  sensitivity?: number
  maxRotation?: number
  preview?: boolean
}

export const useMouseTilt = ({ ref, sensitivity = 40, maxRotation = 15, preview = false }: UseMouseTiltProps) => {
  const effectiveMax = preview ? 8 : maxRotation
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref?.current) return
    const { clientX, clientY } = e
    const rect = ref.current!.getBoundingClientRect()
    const x = (clientX - (rect.left + rect.width / 2)) / (sensitivity ?? 40)
    const y = (clientY - (rect.top + rect.height / 2)) / (sensitivity ?? 40)

    gsap.to(ref.current!, {
      rotateY: Math.max(-(maxRotation ?? 15), Math.min(maxRotation ?? 15, x * 0.5)),
      rotateX: Math.max(-(maxRotation ?? 15), Math.min(maxRotation ?? 15, -y * 0.5)),
      duration: 0.8,
      ease: 'power2.out'
    })
  }, [ref, sensitivity, maxRotation])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return handleMouseMove
}

