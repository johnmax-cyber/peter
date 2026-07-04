import { describe, it, expect } from 'vitest'
import { SM2 } from '@/lib/sm2'

describe('SM2 Algorithm', () => {
  it('should calculate correct values for quality >= 3', () => {
    const result = SM2.calculate(2.5, 1, 4)
    expect(result.easeFactor).toBe(2.5 + (5 - 4) * (8 - (5 - 4) * 2) / 15)
    expect(result.interval).toBe(6)
  })

  it('should reset interval for quality < 3', () => {
    const result = SM2.calculate(2.5, 6, 2)
    expect(result.interval).toBe(1)
    expect(result.easeFactor).toBeLessThan(2.5)
  })
})