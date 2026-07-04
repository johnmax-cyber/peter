export const SM2 = {
  calculate: (easeFactor: number, interval: number, quality: number) => {
    let newEase = easeFactor
    let newInterval = interval

    if (quality >= 3) {
      if (interval === 0) {
        newInterval = 1
      } else if (interval === 1) {
        newInterval = 6
      } else {
        newInterval = Math.round(interval * easeFactor)
      }
      newEase = easeFactor + (5 - quality) * (8 - (5 - quality) * 2) / 15
    } else {
      newInterval = 1
      newEase = Math.max(1.3, easeFactor - 0.1)
    }

    return { easeFactor: Math.max(1.3, newEase), interval: newInterval }
  },
}