const hre = require("hardhat");

const tokens = (n) => {
  return hre.ethers.parseEther(n);
};

async function main() {
  // Setup accounts & variables
  const [deployer] = await hre.ethers.getSigners();
  const NAME = "MTicket";
  const SYMBOL = "MT";

  // Deploy contract
  const NFTTicket = await hre.ethers.getContractFactory("NFTTicket");
  const nftTicket = await NFTTicket.deploy(NAME, SYMBOL);
  // await nftTicket.deployed();
  console.log(`Deployed  Contract at: ${nftTicket.address}\n`);

  // List 5 events
  const events = [
    {
      name: "NexFi Expo 2024",
      cost: tokens("3"),
      tickets: 0,
      date: "May 31",
      time: "6:00PM GMT",
      location: "Accra, Ghana"
    },
    {
      name: "Experience Expo",
      cost: tokens("1"),
      tickets: 125,
      date: "Jun 2",
      time: "1:00PM GMT",
      location: "Tokyo, Japan"
    },
    {
      name: "ETHDev Hackathon",
      cost: tokens("0.25"),
      tickets: 200,
      date: "Jun 9",
      time: "10:00AM TRT",
      location: "Turkey, Istanbul"
    },
    {
      name: "Web3 Lagos",
      cost: tokens("5"),
      tickets: 0,
      date: "Jun 11",
      time: "2:30PM GMT+1",
      location: "Lagos, Nigeria"
    },
    {
      name: "ETH Global Toronto",
      cost: tokens("1.5"),
      tickets: 125,
      date: "Jun 23",
      time: "11:00AM EST",
      location: "Toronto, Canada"
    }
  ];

  for (let i = 0; i < events.length; i++) {
    const transaction = await nftTicket.connect(deployer).listEvent(
      events[i].name,
      events[i].cost,
      events[i].tickets,
      events[i].date,
      events[i].time,
      events[i].location
    );

    await transaction.wait();

    console.log(`Listed Event ${i + 1}: ${events[i].name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
