import React from 'react'
import { ethers } from 'ethers'
import "./Card.css"

const Card = ({ event, toggle, setToggle, setOccasion }) => {
  
  const togglePop = () => {
    setOccasion(event)
    toggle ? setToggle(false) : setToggle(true)
  }

  return (
    <div className='card'>
      <div className='card-info'>
        <p className='card-date'>
          <strong>{event.date}</strong><br />{event.time}
        </p>

        <h3 className='card-name'>
          {event.name}
        </h3>

        <p className='card-location'>
          <small>{event.location}</small>
        </p>

        <p className='card-cost'>
          <strong>
            {ethers.formatEther(event.cost)}
          </strong>ETH
        </p>

        {event.tickets.toString() === "0" ? (
          <button
            type="button"
            className='card-button--out'
            disabled
          >
            Sold Out
          </button>
        ) : (
          <button
            type="button"
            className='card-button'
            onClick={() => togglePop()}
          >
            View Seats
          </button>
        )}
      </div>
      <hr />
    </div >
  );
}

export default Card;