// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTTicket is ERC721 {
    address public owner;
    uint256 public totalEvents;
    uint256 public totalSupply;

    struct ListedEvent {
        uint256 id;
        string name; 
        uint256 cost;
        uint256 tickets;
        string date;
        string time;
        string location;
    }

    mapping(uint256 => ListedEvent) listedEvents;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => uint256[]) public seatsTaken;
 
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor(
        string memory _name, 
        string memory _symbol)
        ERC721(_name, _symbol){
        owner = msg.sender;
    }

    function listEvent(
        string memory _name, 
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location 
    ) public onlyOwner {
        totalEvents++;

        listedEvents[totalEvents] = ListedEvent(
            totalEvents,
            _name, 
            _cost,
            _maxTickets,
            _date,
            _time,
            _location
        );
    }

    function getListedEvents(uint256 _id) public view returns (ListedEvent memory)  {    
        return listedEvents[_id];
    }

    function mintTicket(uint256 _id, uint256 _seat) public payable {
        require(_id != 0);

        require(_id <= totalEvents);

        require(msg.value >= listedEvents[_id].cost);

        require(seatTaken[_id][_seat] == address(0));
        require(_seat <= listedEvents[_id].tickets);

        listedEvents[_id].tickets -= 1;
        hasBought[_id][msg.sender] = true;
        seatTaken[_id][_seat] = msg.sender;
        seatsTaken[_id].push(_seat); 

        totalSupply++;

        _safeMint(msg.sender, totalSupply);
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory){
        return seatsTaken[_id];
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
