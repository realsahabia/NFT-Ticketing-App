import { useEffect, useState } from 'react'
import {ethers} from "ethers";
// Import Components
import Seat from '../seat/Seat'

// Import Assets
import close from '../../assets/close.svg'

import CAddress from '../../config'
import CABI from '../../abis/NFTTicket.json'

const SeatChart = ({ event, contract, provider, setToggle }) => {
  const [seatsTaken, setSeatsTaken] = useState(false)
  const [hasSold, setHasSold] = useState(false)

  const getSeatsTaken = async () => {
    const seatsTaken = await contract.getSeatsTaken(event.id)
    setSeatsTaken(seatsTaken)
  }

  const buyHandler = async (_seat) => {
    setHasSold(false)

    const signer = await provider.getSigner()
    const contractAddress = CAddress[31337].NFTTicket.address
    const blockData = new ethers.Contract(contractAddress, CABI, signer)
    // const transaction = await contract.connect(signer).mintTicket(event.id, _seat, { value: event.cost })
    console.log(blockData)
    const transaction = await blockData.mintTicket(event.id, _seat, { value: event.cost })
    await transaction.wait()

    setHasSold(true)
  }

  useEffect(() => {
    getSeatsTaken()
  }, [hasSold])

  return (
    <div className="occasion">
      <div className="occasion-seating">
        <h1>{event.name} Seating Map</h1>

        <button onClick={() => setToggle(false)} className="occasion-close">
          <img src={close} alt="Close" />
        </button>

        <div className="occasion-stage">
          <strong>STAGE</strong>
        </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={1}
            columnStart={0}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion-spacer--1 ">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(Number(event.maxTickets) - 50).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={26}
            columnStart={6}
            maxColumns={15}
            rowStart={2}
            maxRows={15}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion-spacer--2">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={(Number(event.maxTickets) - 24)}
            columnStart={22}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}
      </div>
    </div >
  );
}

export default SeatChart;