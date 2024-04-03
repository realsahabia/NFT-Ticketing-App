import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
// import Sort from './components/Sort'
import Card from './components/Card'
// import SeatChart from './components/SeatChart'

// ABIs
import NFTTicket_abi from './abis/NFTTicket.json'

// Config
import config from './config.json'

function App() {
const [account, setAccount] = useState(null)
const [provider, setProvider] = useState(null)

const [NFTTicketContract, setNFTTicketContract]  = useState(null)
const [events, setEvents] = useState([])


const loadBlockchainData = async () => {
  try {
    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);

    // Refresh account
    window.ethereum.on('accountsChanged', async () => {
      const updatedAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(updatedAccounts[0]);
    });

    // Load contract data
    let currentProvider = provider;
    if (!currentProvider) {
      currentProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(currentProvider);
    }

    const network = await currentProvider.getNetwork();
    console.log("Current Network is " + network.name);
    const contractAddress = config[31337].NFTTicket.address;
    const NFTTicketContract = new ethers.Contract(contractAddress, NFTTicket_abi, currentProvider);
    console.log("Token master contract", NFTTicketContract);
    
    // Set NFTTicketContract state
    setNFTTicketContract(NFTTicketContract);

    // List events
    await listEvents(NFTTicketContract);
  } catch (error) {
    console.error("Error loading blockchain data:", error);
  }
};

const listEvents = async (contract) => {
  // Define the tokens function here or import it
  const ONE_GWEI = BigInt(1_000_000_000);

  const tokens = (n) => {
    return n * ONE_GWEI;
  }

  const eventsToAdd = [
    {
      name: "NexFi Expo 2024",
      cost: tokens(3),
      tickets: 0,
      date: "May 31",
      time: "6:00PM GMT",
      location: "Accra, Ghana"
    },
    {
      name: "Experience Expo",
      cost: tokens(1),
      tickets: 125,
      date: "Jun 2",
      time: "1:00PM GMT",
      location: "Tokyo, Japan"
    },
    {
      name: "ETHDev Hackathon",
      cost: tokens(0.25),
      tickets: 200,
      date: "Jun 9",
      time: "10:00AM TRT",
      location: "Turkey, Istanbul"
    },
    {
      name: "Web3 Lagos",
      cost: tokens(5),
      tickets: 0,
      date: "Jun 11",
      time: "2:30PM GMT+1",
      location: "Lagos, Nigeria"
    },
    {
      name: "ETH Global Toronto",
      cost: tokens(1.5),
      tickets: 125,
      date: "Jun 23",
      time: "11:00AM EST",
      location: "Toronto, Canada"
    }
  ];

  for (let i = 0; i < eventsToAdd.length; i++) {
    await contract.listEvent(
      eventsToAdd[i].name,
      eventsToAdd[i].cost,
      eventsToAdd[i].tickets,
      eventsToAdd[i].date,
      eventsToAdd[i].time,
      eventsToAdd[i].location
    );

    console.log(`Listed Event ${i + 1}: ${eventsToAdd[i].name}`);
  }
};

  useEffect(() =>{
   loadBlockchainData();
  },  []);

  return (
    <div>
        <header>
          <Navigation account={account} setAccount={setAccount}/>
          <h2 className="header__title"><strong>Available</strong> Events</h2>
        </header>

        <div className='card'>
          {events.map((item, index) =>(
            <p key={index}>{item.name}</p>
          ))}
        </div>

    </div>
  );
}

export default App;