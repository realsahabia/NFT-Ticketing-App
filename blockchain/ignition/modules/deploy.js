const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const NAME = "MTicket";
const SYMBOL = "MT";

module.exports = buildModule("NFTTicketModule", (m) => {
  const nftTicket = m.contract("NFTTicket", [NAME, SYMBOL]);
  return { nftTicket };
});

async function listEvents(nftTicket, events, deployer) {
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

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const ONE_GWEI = BigInt(1_000_000_000);

  const tokens = (n) => {
    return n * ONE_GWEI;
  }

  const events = [
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

  const nftTicketModule = await hre.deployModule("NFTTicketModule");
  const nftTicket = await nftTicketModule.nftTicket.deployed();

  await listEvents(nftTicket, events, deployer);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
