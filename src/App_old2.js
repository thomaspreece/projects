import React, { useState, useRef } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import './styles.css'

const card_images = [
  'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg'
]

const max_cards = card_images.length

// Resting position of card i
const to = i => ({
  x: 0,
  y: -i * 4,
  scale: 1,
  rot: -10 + Math.random() * 20,
})

// How cards enter the deck (from top)
const from = i => ({
  x: 0,
  y: -i *4,
  scale: 1,
  rot: 0
})

// Transform for a card
const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

function Deck() {

  // The order array determines which card is on top
  // Example: [0,1,2,3,4] → 4 is top card
  const [order, setOrder] = useState(
    Array.from({ length: max_cards }, (_, i) => i)
  )

  // Create the springs based on order
  const [props, api] = useSprings(max_cards, index => ({
    ...to(index),
    from: from(index)
  }))

  // Flip a card (top → bottom)
  const flip = () => {
    const topCard = order[order.length - 1]

    api.start((i) => {
      if (i === max_cards - 1) {
        // This is the top card → animate it down
        return {
          y: 1000,
          scale: 1.2,
          rot: 20,
          config: { tension: 200, friction: 30 },
          onRest: () => {
            // After animation ends → move this card to bottom
            setOrder((prev) => {
              const newOrder = [...prev]
              newOrder.pop()
              newOrder.unshift(topCard)
              return newOrder
            })

            // Re-run springs with new order (card re-enters)
            api.start((i2) => ({
              ...to(i2),
              from: from(i2)
            }))
          }
        }
      }

      // Other cards stay put until order changes
      return {}
    })
  }

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      flip()
    }
  }

  const card_jsx = order.map((cardIndex, springIndex) => {
    const { x, y, rot, scale } = props[springIndex]
    return (
      <animated.div
        key={cardIndex}
        style={{
          transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`)
        }}
      >
        <animated.div
          style={{
            transform: interpolate([rot, scale], trans),
            backgroundImage: `url(${card_images[cardIndex]})`
          }}
        />
      </animated.div>
    )
  })

  return (
    <div id="cardroot" onKeyDown={handleKeyDown} tabIndex={0}>
      {card_jsx}
    </div>
  )
}

export default Deck
