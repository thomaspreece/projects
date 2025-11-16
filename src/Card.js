import React, { useState, useRef } from 'react'
import { useSpring, animated, to } from 'react-spring'
import './styles.css'

// TODO: Fix issue where cards flip if you move more than one at a time 

const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

function Card({cardPosition, cardIndex, maximumCards, cardData}) {
  const cardDataMaximum = cardData.length

  const cardRef = useRef(null);
  
  var width = 0
  var height = 0
  
  if(cardRef.current){
    const boundingRect = cardRef.current.getBoundingClientRect()
    width = boundingRect.width
    height = boundingRect.height
  }
  

  const maximumIndex = maximumCards - 1
  
  const zIndex = i => {
    return i % maximumCards  
  }

  const cuttoff = Math.floor(maximumCards/2)
  
  // These two are just helpers, they curate spring data, values that are later being interpolated into css
  const start_to = i => ({ x: 0, y: (i * 4 - height*0.1), scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 + 1000 })
  const start_from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000, zIndex: zIndex(i) })

  const [props, set] = useSpring(i => ({ ...start_to(cardPosition), from: start_from(cardPosition) })) 

  const [prevCardPosition, setPrevCardPosition] = useState(cardPosition);
  const [dataOffset, setdataOffset] = useState(0);


  if (cardPosition !== prevCardPosition) {
    
    if(prevCardPosition == maximumIndex && cardPosition == 0){
      // Card Moving to back of stack 
      set([{zIndex: 100, x: (width*1.2)}, {zIndex: -100}, start_to(cardPosition), {zIndex: zIndex(cardPosition)}])
    } else if (prevCardPosition == 0 && cardPosition == maximumIndex) {
      // Card Moving to front of stack
      set([{zIndex: -100, x: -(width*1.2)}, {zIndex: 100}, start_to(cardPosition), {zIndex: zIndex(cardPosition)}])
    } else {
      set({zIndex: zIndex(cardPosition), immediate: true})
    }
    setPrevCardPosition(cardPosition);

    if (prevCardPosition==cuttoff && cardPosition == cuttoff-1){
      setdataOffset(dataOffset - maximumCards)
    } else if (prevCardPosition==cuttoff-1 && cardPosition == cuttoff){
      setdataOffset(dataOffset + maximumCards)
    }
  }

  var dataIndex = (cardIndex + dataOffset) % cardData.length
  if(dataIndex < 0){
    dataIndex += cardData.length
  }

  const cardImage = cardData[dataIndex].image

  const card_jsx = <animated.div key={cardPosition} style={{ transform: to([props.x, props.y], (x, y) => `translate3d(${x}px,${y}px,0)`) , zIndex: props.zIndex}} cardnumber={dataIndex}>
    <animated.div ref={cardRef} style={{ transform: to([props.rot, props.scale], trans), backgroundImage: `url(${process.env.PUBLIC_URL}/notebook.png)` }}>
      Position: {cardPosition} <br/>
      Index: {cardIndex} <br />
      Data Index: {dataIndex} <br />
      Data Offset: {dataOffset} <br />
      <img src={cardImage} style={{height: "50%"}}/>
    </animated.div>
  </animated.div>
  return card_jsx
}

export default Card;
