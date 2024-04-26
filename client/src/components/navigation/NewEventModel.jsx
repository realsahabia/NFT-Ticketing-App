import React, { useState } from 'react';
import { ethers } from 'ethers';
import './Navigation.css';

import close from '../../assets/close.svg'

function EventForm({ contract, provider, setNewEventForm }) {
  const [eventName, setEventName] = useState('');
  const [eventCost, setEventCost] = useState('');
  const [eventMaxTickets, setEventMaxTickets] = useState(null);
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert cost to Wei (if necessary)
      const costInWei = ethers.parseEther(eventCost);

      // Call listEvent function from the contract
    const signer = await provider.getSigner();
    const transaction = await contract.connect(signer).listEvent(eventName, costInWei, eventMaxTickets, eventDate, eventTime, eventLocation);

    await transaction.wait();
    alert(`New event added: ${eventName}`);

      // Clear form fields after submission
      setEventName('');
      setEventCost('');
      setEventMaxTickets('');
      setEventDate('');
      setEventTime('');
      setEventLocation('');

      // Handle success (e.g., show success message)
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error('Error:', error);
    }
  };

  return (
    <div className='newEvent'>
        <form onSubmit={handleFormSubmit} className='newEvent_form'>
        
        <div className='newEvent_close'>
            <button onClick={() => setNewEventForm(false)} className="occasion-close">
                <img src={close} alt="Close" />
            </button>
        </div>
        <div className='input-field'>
            <label>Event Name:</label>
            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
        </div>
        <div className='input-field'>
            <label>Event Cost (ETH):</label>
            <input type="number" step="0.01" value={eventCost} onChange={(e) => setEventCost(e.target.value)} required />
        </div>
        <div className='input-field'>
            <label>Maximum Tickets:</label>
            <input type="number" value={eventMaxTickets} onChange={(e) => setEventMaxTickets(e.target.value)} required />
        </div>
        <div className='input-field'>
            <label>Date:</label>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
        </div>
        <div className='input-field'>
            <label>Time:</label>
            <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
        </div>
        <div className='input-field'>
            <label>Location:</label>
            <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} required />
        </div>

        <div className='submit-button'>
            <button 
            type="submit" className='form_btn'>
                Submit Event
            </button>
        </div>
        </form> 
    </div>
  );
}

export default EventForm;
