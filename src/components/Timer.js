'use client'

import { useState, useEffect, useCallback } from 'react'

const Timer = ({ createdAt, duration }) => {
  const [timeLeft, setTimeLeft] = useState(() => {

    const startTime = new Date(createdAt).getTime()
    const endTime = startTime + parseInt(duration)
    const now = new Date().getTime()
    const difference = endTime - now

    if (difference <= 0) return 'Expired'

    const months = Math.floor(difference / (30 * 24 * 60 * 60 * 1000))
    const days = Math.floor((difference % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000))
    const hours = Math.floor((difference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const minutes = Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((difference % (60 * 1000)) / 1000)

    if (months > 0) return `${months}m ${days}d`
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m ${seconds}s`
    return `${seconds}s`
  })

  const calculateTimeLeft = useCallback(() => {
    const startTime = new Date(createdAt).getTime()
    const endTime = startTime + parseInt(duration)
    const now = new Date().getTime()
    const difference = endTime - now

    if (difference <= 0) {
      clearInterval(timer.current)
      return 'Expired'
    }

    const months = Math.floor(difference / (30 * 24 * 60 * 60 * 1000))
    const days = Math.floor((difference % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000))
    const hours = Math.floor((difference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const minutes = Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((difference % (60 * 1000)) / 1000)

    if (months > 0) return `${months}m ${days}d`
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m ${seconds}s`
    return `${seconds}s`
  }, [createdAt, duration])

  useEffect(() => {
    
    const getUpdateInterval = () => {
      const startTime = new Date(createdAt).getTime()
      const endTime = startTime + parseInt(duration)
      const now = new Date().getTime()
      const difference = endTime - now

      if (difference <= 0) return null
      if (difference < 60 * 1000) return 1000
      if (difference < 60 * 60 * 1000) return 60 * 1000
      return 5 * 60 * 1000
    }

    const updateInterval = getUpdateInterval()
    if (!updateInterval) return

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, updateInterval)

    return () => clearInterval(timer)
  }, [createdAt, duration, calculateTimeLeft])

  return (
    <span className="tabular-nums">
      {timeLeft}
    </span>
  )
}

export default Timer 