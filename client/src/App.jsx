import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/navigation/Navigation'
import Sort from './components/sort/Sort'
import Card from './components/card/Card'
import SeatChart from './components/seatchart/SeatChart'

// ABIs
import NFTTicket_abi from './abis/NFTTicket.json'

// Config
import config from './config.json'

function App() {
const [account, setAccount] = useState(null)
const [provider, setProvider] = useState(null)

const [NFTTicketContract, setNFTTicketContract]  = useState(null)
const [events, setEvents] = useState([])
const [occasion, setOccasion] = useState({})
const [toggle, setToggle] = useState(false)


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
      currentProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(currentProvider);
    }

    const network = await currentProvider.getNetwork();
    console.log("Current Network is " + network.name);

    const contractAddress = config[31337].NFTTicket.address;
    const NFTTicketContract = new ethers.Contract(contractAddress, NFTTicket_abi, currentProvider);
    // console.log("Token master contract", NFTTicketContract);
    
    // Set NFTTicketContract state
    setNFTTicketContract(NFTTicketContract);

    const avaiEvents = await NFTTicketContract.totalEvents();
    // console.log({avaiEvents: avaiEvents.toString()})

    const eventsList = [];

    for (let i = 1; i <= avaiEvents; i++){
      const singleEvent = await NFTTicketContract.getListedEvents(i);
      eventsList.push(singleEvent)
    }

    setEvents(eventsList);
    console.log(eventsList)
    // List events
  } catch (error) {
    console.error("Error loading blockchain data:", error);
  }
};



  useEffect(() =>{
   loadBlockchainData();
  }, []);

  return (
    <div>
        <header>
          <Navigation account={account} setAccount={setAccount}/>
          <h2 className="header__title"><strong>Available</strong> Events</h2>
        </header>
        <Sort />
        <div className='card'>
          {events.map((item, index) =>(
            <Card
            event={item}
            id={index + 1}
            contract={NFTTicketContract}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
            key={index}
          />
        ))}
        </div>

        {toggle && (
            <SeatChart 
              event= {occasion}
              contract={NFTTicketContract}
              provider={provider}
              setToggle={setToggle}
            />
        )}

    </div>
  );
}

export default App;