import React, { useState } from 'react'
import { useSprings, animated, to } from 'react-spring'
import './styles.css'

//https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg
const card_images = [  
  'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg'  
]

const max_rendered_cards = 3
var top_rendered_card = max_rendered_cards - 1 // 0 - 4
var bottom_rendered_card = 0

const zIndex = i => {
  return (i - top_rendered_card + max_rendered_cards - 1) % max_rendered_cards  
}

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const start_to = i => ({ x: 0, y: i * 4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 + 1000 })
const start_from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000, zIndex: zIndex(i) })

// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

const remove_card = (position="top") => {
  if(position == "top"){
    top_rendered_card = (top_rendered_card - 1)
    if (top_rendered_card < 0){
      top_rendered_card = top_rendered_card + max_rendered_cards
    }
    bottom_rendered_card = top_rendered_card - (max_rendered_cards -1)
    if (bottom_rendered_card < 0){
      bottom_rendered_card = bottom_rendered_card + max_rendered_cards
    }
  }else {
    top_rendered_card = (top_rendered_card + 1) % max_rendered_cards
    bottom_rendered_card = top_rendered_card - (max_rendered_cards -1)
    if (bottom_rendered_card < 0){
      bottom_rendered_card = bottom_rendered_card + max_rendered_cards
    }
  }
  console.log(`Top Card: ${top_rendered_card}. Bottom Card: ${bottom_rendered_card}`)
}

function Deck() {
  const previous = () => {
    console.log(top_rendered_card)
    const old_bottom_rendered_card = bottom_rendered_card
    remove_card("bottom")
    
    set((i) => {   
        if (i!=old_bottom_rendered_card) {
          return {
            zIndex: zIndex(i)
          } 
        }
        return [{zIndex: -1000+i}, {x: -1200}, {zIndex: 1000}, start_to(i), {zIndex: zIndex(i)}]
    })
  }
  
  const next = () => {
    console.log(top_rendered_card)
    const old_top_rendered_card = top_rendered_card
    remove_card("top")
    set((i) => {   
        if (i!=old_top_rendered_card) {
          return {
            zIndex: zIndex(i)
          } 
        }
        return [{zIndex: 1000-i}, {x: 1200}, {zIndex: -1000}, start_to(i), {zIndex: zIndex(i)}]
    })
  }

  const [spring_props, set] = useSprings(max_rendered_cards ,i => ({ ...start_to(i), from: start_from(i) })) 

  var props = {
    spring_props: spring_props,
    current_card: 0,
  }

  const handleKeyDown = (event) => {
      if(event.key == "ArrowRight"){
        next()  
        props.current_card += 1
        console.log(props.current_card)
      }
      if(event.key == "ArrowLeft") {
        previous()
      }
  };

  const card_jsx = props.spring_props.map((proplist, i) => {
    let x, y, rot, scale, zIndex
    ({ x, y, rot, scale, zIndex } = proplist)
    return <animated.div key={i} style={{ transform: to([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) , zIndex: zIndex}}>
      <animated.div style={{ transform: to([rot, scale], trans), backgroundImage: `url(${card_images[i]})` }}>
        Number: {max_rendered_cards - i -1}<br/>
        Adjusted Number: {max_rendered_cards - i -1 + props.current_card}  
      </animated.div>
    </animated.div>
  })
  return <div id="cardroot" onKeyDown={handleKeyDown} tabIndex={0}>
    {card_jsx}
  </div>
}



export default Deck;
