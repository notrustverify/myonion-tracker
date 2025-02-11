'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { getTokensList } from '../lib/configs'
import LoanModal from './LoanModal'
import Matter from 'matter-js'

const getTokenInfo = (tokenId) => {
  const tokens = getTokensList()
  return tokens.find(t => t.id === tokenId) || {
    symbol: 'Unknown',
    logoURI: '/tokens/unknown.png',
    decimals: 18
  }
}

const getStatusColor = (collateralRatio) => {
  if (collateralRatio >= 400) return 'rgba(74, 222, 128, 0.2)'
  if (collateralRatio >= 250) return 'rgba(250, 204, 21, 0.2)'
  return 'rgba(248, 113, 113, 0.2)'
}

const getStatusSize = (collateralRatio) => {
  if (collateralRatio >= 400) return 120
  if (collateralRatio >= 250) return 100
  return 80
}

const LoanBubble = ({ 
  value,
  currency,
  collateralAmount,
  collateralCurrency,
  term,
  interest,
  lender,
  borrower,
  status,
  liquidation,
  canLiquidate,
  collateralRatio,
  id,
  containerRef,
  engine,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const bubbleRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const bodyRef = useRef(null)
  const size = getStatusSize(collateralRatio)
  const statusColor = getStatusColor(collateralRatio)

  useEffect(() => {
    if (!containerRef?.current || !engine || !bubbleRef.current) return

    const container = containerRef.current
    const bounds = container.getBoundingClientRect()

    const startX = bounds.width / 2 + (Math.random() - 0.5) * (bounds.width / 2)
    const startY = bounds.height / 2 + (Math.random() - 0.5) * (bounds.height / 2)
    
    setPosition({ x: startX - size / 2, y: startY - size / 2 })

    const bubble = Matter.Bodies.circle(startX, startY, size / 2, {
      restitution: 0.7,
      friction: 0.01,
      frictionAir: 0.001,
      mass: size / 80,
      label: `loan-${id}`,
      collisionFilter: {
        group: 0,
        category: 0x0002,
        mask: 0xFFFFFFFF
      }
    })

    const angle = Math.random() * Math.PI * 2
    const forceMagnitude = 0.05
    const force = {
      x: Math.cos(angle) * forceMagnitude,
      y: Math.sin(angle) * forceMagnitude
    }
    
    Matter.Body.applyForce(bubble, bubble.position, force)
    Matter.World.add(engine.world, bubble)
    bodyRef.current = bubble

    let lastUpdate = 0
    const updatePosition = () => {
      if (!bodyRef.current) return

      const now = Date.now()
      if (now - lastUpdate < 16) return

      const newPos = {
        x: bodyRef.current.position.x - size / 2,
        y: bodyRef.current.position.y - size / 2
      }

      setPosition(newPos)
      lastUpdate = now
    }

    Matter.Events.on(engine, 'afterUpdate', updatePosition)

    return () => {
      Matter.Events.off(engine, 'afterUpdate', updatePosition)
      if (bodyRef.current) {
        Matter.World.remove(engine.world, bodyRef.current)
        bodyRef.current = null
      }
    }
  }, [containerRef, engine, size, id])

  return (
    <>
      <motion.div 
        ref={bubbleRef}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: size,
          height: size,
          background: statusColor,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 10,
          pointerEvents: 'auto',
        }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsModalOpen(true)}
        className="rounded-full flex flex-col items-center justify-center cursor-pointer border border-white/10
          shadow-lg hover:shadow-xl transition-shadow duration-200"
      >
        <div className="flex items-center gap-1 mb-1">
          <img 
            src={getTokenInfo(currency).logoURI}
            alt={getTokenInfo(currency).symbol}
            className="w-5 h-5 rounded-full"
          />
          <span className="text-white text-xs">→</span>
          <img 
            src={getTokenInfo(collateralCurrency).logoURI}
            alt={getTokenInfo(collateralCurrency).symbol}
            className="w-5 h-5 rounded-full"
          />
        </div>
        <div className="text-white text-xs font-medium">{Math.round(collateralRatio)}%</div>
        <div className="text-gray-400 text-[10px]">Ratio</div>
      </motion.div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]">
          <LoanModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            loan={{
              tokenAmount: value,
              tokenRequested: currency,
              collateralAmount: collateralAmount,
              collateralToken: collateralCurrency,
              duration: term,
              interest: interest,
              lender: lender,
              borrower: borrower,
              status: status,
              liquidation: liquidation,
              canLiquidate: canLiquidate,
              id: id
            }}
          />
        </div>,
        document.body
      )}
    </>
  )
}

export default LoanBubble 