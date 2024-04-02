const { ethers } = require('hardhat');
const { expect } = require("chai");

const NAME = "MTicket";
const SYMBOL = "MT";

const OCCASION_NAME = "NexFi Expo 2024"
const OCCASION_COST  = "1"
const OCCASION_MAX_TICKETS = "100"
const OCCASION_DATE = "Apr 27"
const OCCASION_TIME = "10:00AM GMT"
const OCCASION_LOCATION = "Accra, Ghana"

describe("NFTTicket", function () {
  let nftTicket;
  let deployer, buyer;

  beforeEach(async function () {
    [deployer, buyer] = await ethers.getSigners();

    nftTicket = await ethers.deployContract("NFTTicket", [NAME, SYMBOL]);

    let transaction = await nftTicket.connect(deployer).listEvent(
      OCCASION_NAME,
      OCCASION_COST,
      OCCASION_MAX_TICKETS,
      OCCASION_DATE,
      OCCASION_TIME,
      OCCASION_LOCATION
    )

    await transaction.wait()
  });

  it("should set the name correctly", async function () {
    expect(await nftTicket.name()).to.equal(NAME);
  });

  it("should set the symbol correctly", async function() {
    expect(await nftTicket.symbol()).to.equal(SYMBOL);
  });

  it("should have the deployer as the owner", async function() {
    expect(await nftTicket.owner()).to.equal(deployer.address);
  });

  describe("listedEvents", () => {

    it("Updates event count", async function () {
      const totalEvents = await nftTicket.totalEvents();
      expect(totalEvents).to.equal(1)
    })

    it('Returns listedEvent attributes', async function () {
      const totalEvents = await nftTicket.getListedEvents(1)
      expect(totalEvents.id).to.be.equal(1)
      expect(totalEvents.name).to.be.equal(OCCASION_NAME)
      expect(totalEvents.cost).to.be.equal(OCCASION_COST)
      expect(totalEvents.tickets).to.be.equal(OCCASION_MAX_TICKETS)
      expect(totalEvents.date).to.be.equal(OCCASION_DATE)
      expect(totalEvents.time).to.be.equal(OCCASION_TIME)
      expect(totalEvents.location).to.be.equal(OCCASION_LOCATION)
    })
  })

  describe("Minting", () => {
    const ID = 1
    const SEAT = 50
    const AMOUNT = "1"

    beforeEach(async function () {
      const transaction = await nftTicket.connect(buyer).mintTicket(ID, SEAT, { value: AMOUNT })
      await transaction.wait()
    })

    it('Updates ticket count', async function () {
      const totalEvents = await nftTicket.getListedEvents(1)
      expect(totalEvents.tickets).to.be.equal(OCCASION_MAX_TICKETS - 1)
    })

    it('Updates buying status', async function () {
      const status = await nftTicket.hasBought(ID, buyer.address)
      expect(status).to.be.equal(true)
    })

    it('Updates seat status', async function () {
      const owner = await nftTicket.seatTaken(ID, SEAT)
      expect(owner).to.equal(buyer.address)
    })

    it("Updates overall seating status", async function () {
      const seats = await nftTicket.getSeatsTaken(ID)
      expect(seats.length).to.equal(1)
      expect(seats[0]).to.equal(SEAT)  
    })
  })

  
});