'use client'

import { useState, useEffect, useCallback } from 'react'

const AuctionTimer = ({ endTime }) => {
  const calculateTimeLeft = useCallback(() => {
    try {
      const end = new Date(endTime).getTime()
      const now = new Date().getTime()
      
      if (isNaN(end)) return 'Invalid date'
      
      const difference = end - now

      if (difference <= 0) return 'Ended'

      const days = Math.floor(difference / (24 * 60 * 60 * 1000))
      const hours = Math.floor((difference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
      const minutes = Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000))
      const seconds = Math.floor((difference % (60 * 1000)) / 1000)

      if (days > 0) return `${days}d ${hours}h`
      if (hours > 0) return `${hours}h ${minutes}m`
      if (minutes > 0) return `${minutes}m ${seconds}s`
      return `${seconds}s`
    } catch (error) {
      console.error('Error calculating time left:', error)
      return 'Invalid date'
    }
  }, [endTime])

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft)

  useEffect(() => {
    const getUpdateInterval = () => {
      const end = new Date(endTime).getTime()
      const now = new Date().getTime()
      const difference = end - now

      if (difference <= 0) return null
      if (difference < 60 * 60 * 1000) return 1000
      if (difference < 24 * 60 * 60 * 1000) return 60 * 1000
      return 5 * 60 * 1000
    }

    const updateInterval = getUpdateInterval()
    if (!updateInterval) return

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, updateInterval)

    return () => clearInterval(timer)
  }, [endTime, calculateTimeLeft])

  return (
    <span className="tabular-nums">
      {timeLeft}
    </span>
  )
}

export default AuctionTimer 