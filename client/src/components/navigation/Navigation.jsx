import React, {useState, useEffect} from 'react'
import { ethers } from 'ethers'
import "./Navigation.css"

import NewEvent from './NewEventModel';

const Navigation = ({ account, provider, contract, connectHandler }) => {
  const [isAdmin, setIsAmin] = useState(false)
  const [newEventForm, setNewEventForm] = useState(false)

  const deployerAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

  function adminButton() {
    if (account && account.toLowerCase() === deployerAccount.toLowerCase()) {
      setIsAmin(true);
    } else {
      console.log(account + " is not an Admin.");
    }
  }
  

  // async function addEvent(){
  //   const signer = await provider.getSigner();
  //   const transaction = await contract.connect(signer).listEvent(event.id, _seat, { value: event.cost })
  // }

  useEffect(() =>{
    adminButton();
  }, [account]);

  return (
    <div>
    <nav>
      <div className='nav-brand'>
        <h1>Onchain Events</h1>

        <input className='nav-search' type="text" placeholder='Find millions of experiences' />

        <ul className='nav-links'>
          <li><a href="/">Concerts</a></li>
          <li><a href="/">Sports</a></li>
          <li><a href="/">More</a></li>
        </ul>
      </div>

      {
        isAdmin ? (
          <button
            type='button'
            className='nav-connect'
            onClick={()=>{setNewEventForm(true)}}
          >
            Add Event
          </button>
      ): (
        <button
            type='button'
            className='invisible'
          >
            Add Event
          </button>
      )
      
      }

      {account ? (
        <button
          type="button"
          className='nav-connect'
        >
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className='nav-connect'
          onClick={connectHandler}
        >
          Connect Wallet
        </button>
      )}     
    </nav>

    {
        newEventForm && (
          <NewEvent 
          contract={contract} 
          provider={provider}
          setNewEventForm={setNewEventForm}
          />
      )}
    </div>

  
  );
}

export default Navigation;