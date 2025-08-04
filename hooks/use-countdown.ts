"use client"

import { useState, useEffect } from "react"

interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMilliseconds: number
  isFinished: boolean
}

export function useCountdown(targetDate: string): Countdown {
  const countDownDate = new Date(targetDate).getTime()

  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown(countDownDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(countDownDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [countDownDate])

  return countdown
}

function getCountdown(countDownDate: number): Countdown {
  const now = new Date().getTime()
  const distance = countDownDate - now

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMilliseconds: distance,
    isFinished: distance < 0,
  }
}
