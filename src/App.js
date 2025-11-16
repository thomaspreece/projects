import React, { useState } from 'react'
import './styles.css'
import Card from './Card';

const maxRenderedCards = 8

const cardData = [  
  {image: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg', name: "card-1"},
  {image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg', name: "card-2"},
  {image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg', name: "card-3"},
  {image: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg', name: "card-4"},
  {image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg', name: "card-5"},  
  {image: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg', name: "card-6"},
  {image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg', name: "card-7"},
  {image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg', name: "card-8"},
  {image: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg', name: "card-9"},
  {image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg', name: "card-10"} , 
  {image: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg', name: "card-11"},
  {image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg', name: "card-12"},
  {image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg', name: "card-13"},
  {image: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg', name: "card-14"},
  {image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg', name: "card-15"}      
]

function Deck() {

  const [offset, setOffset] = useState(0);

  const handleKeyDown = (event) => {
      if(event.key == "ArrowRight"){
        setOffset(offset + 1)
      }
      if(event.key == "ArrowLeft") {
        setOffset(offset - 1)
      }
  };

  var deck_jsx = []
  Array.from({ length: maxRenderedCards }, (x, i) => {
    const cuttoff = Math.ceil(maxRenderedCards/2)

    // Card Index. Orders cards so front has 0,1,2,3... and back has -1,-2,-3,...
    // Numbers meet in middle of card stack at cuttoff
    var cardIndex = maxRenderedCards - i - 1
    if (cardIndex >= cuttoff) {
      cardIndex = - (maxRenderedCards-cardIndex)
    }

    // Card Position back=0, front=max
    var cardPosition = (i + offset) % maxRenderedCards
    if(cardPosition < 0) {
      cardPosition += maxRenderedCards
    }

    deck_jsx.push(<Card 
      key={i} 
      cardData={cardData}
      cardPosition={cardPosition} 
      cardIndex={cardIndex} 
      maximumCards={maxRenderedCards} 
    />)
  });

  return <div id="cardroot" onKeyDown={handleKeyDown} tabIndex={0}>
    {deck_jsx}
  </div>
}



export default Deck;
