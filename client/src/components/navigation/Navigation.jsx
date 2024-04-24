import { ethers } from 'ethers'
import "./Navigation.css"

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAccount(accounts[0])
  }

  return (
    <nav>
      <div className='nav__brand'>
        <h1>Onchain Events</h1>

        <input className='nav__search' type="text" placeholder='Find millions of experiences' />

        <ul className='nav__links'>
          <li><a href="/">Concerts</a></li>
          <li><a href="/">Sports</a></li>
          <li><a href="/">Arts & Theater</a></li>
          <li><a href="/">More</a></li>
        </ul>
      </div>

      {account ? (
        <button
          type="button"
          className='nav__connect'
        >
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className='nav__connect'
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
    </nav>
  );
}

export default Navigation;