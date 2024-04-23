// SPDX-License-Identifier: UNLICENSED
// THIS CONTRACT IMPLEMENTS AN ERC721 COMPLIANT NFT FOR TICKETING PURPOSES

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTTicket is ERC721 {
    // OWNER OF THE CONTRACT
    address public owner;
    // TOTAL NUMBER OF EVENTS LISTED
    uint256 public totalEvents;
    // TOTAL NUMBER OF TICKETS MINTED
    uint256 public totalSupply;

    // STRUCTURE TO STORE DETAILS OF A LISTED EVENT
    struct ListedEvent {
        uint256 id;
        string name; 
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    // MAPPINGS TO STORE EVENT DETAILS, TICKET PURCHASE STATUS, AND SEAT ALLOCATION
    mapping(uint256 => ListedEvent) listedEvents;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => uint256[]) public seatsTaken;
 
    // MODIFIER TO RESTRICT FUNCTION ACCESS TO THE OWNER
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
      
    // CONTRACT CONSTRUCTOR TO SET OWNER AND ERC721 METADATA
    constructor(
        string memory _name, 
        string memory _symbol)
        ERC721(_name, _symbol){
        owner = msg.sender;
    }

    // FUNCTION TO LIST AN EVENT WITH GIVEN DETAILS
    function listEvent(
        string memory _name, 
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location 
    ) public onlyOwner {
        // INCREMENT TOTAL EVENTS
        totalEvents++;
        
        // ADD EVENT DETAILS TO MAPPING
        listedEvents[totalEvents] = ListedEvent(
            totalEvents,
            _name, 
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );
    }

    // FUNCTION TO RETRIEVE DETAILS OF A LISTED EVENT
    function getListedEvents(uint256 _id) public view returns (ListedEvent memory)  {    
        return listedEvents[_id];
    }

    // FUNCTION TO MINT A TICKET FOR THE SPECIFIED EVENT AND SEAT
    function mintTicket(uint256 _id, uint256 _seat) public payable {
        // REQUIRE THAT EVENT ID IS VALID
        require(_id != 0);
        require(_id <= totalEvents);
        // REQUIRE THAT SENT ETH IS EQUAL TO OR GREATER THAN COST
        require(msg.value >= listedEvents[_id].cost);
        // REQUIRE THAT SEAT IS AVAILABLE AND EXISTS
        require(seatTaken[_id][_seat] == address(0));
        require(_seat <= listedEvents[_id].tickets);

        // UPDATE EVENT DETAILS AND TICKET STATUS
        listedEvents[_id].tickets -= 1; // UPDATE TICKET COUNT
        hasBought[_id][msg.sender] = true; // UPDATE BUYING STATUS
        seatTaken[_id][_seat] = msg.sender; // ASSIGN TICKET TO USER
        seatsTaken[_id].push(_seat); // UPDATE SEATS CURRENTLY TAKEN

        // INCREMENT TOTAL SUPPLY AND MINT TOKEN TO BUYER
        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    // FUNCTION TO RETRIEVE SEATS TAKEN FOR A SPECIFIC EVENT
    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory){
        return seatsTaken[_id];
    }

    // FUNCTION TO WITHDRAW CONTRACT BALANCE TO OWNER
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
