pragma solidity >=0.4.21 <0.7.0;

import "./Music.sol";

contract MusicBasic {

    /** @dev stores medicine batch addresses || chain point addresses || medicine batch transfer by guid */
    mapping(bytes32 => address) public contractAddresses;

    /** @dev stores which addresses are owned by Global administrators */
    mapping (address => bool) public admins;

    /** @dev stores the address of the Global Administrator */
    address public globalAdmin;
    
    constructor() public {
        globalAdmin = msg.sender;
        admins[msg.sender] = true;
    }

    // ================Music Functions================
    function addMusic(
        string memory _guid,
        string memory _name,
        string memory _address,
        string memory _phoneNumber,
        string memory _taxCode,
        string memory _registrationCode)
        public
        onlyAdmin
    {
        bytes32 key = getKey(_guid);

        Music newChainPoint = new Music(
            _guid,
            _name,
            _address,
            _phoneNumber,
            _taxCode,
            _registrationCode,
            msg.sender);

        contractAddresses[key] = address(newChainPoint);

    }

    function removeMusic(string memory _guid) public onlyAdmin {
        bytes32 key = getKey(_guid);

        delete contractAddresses[key];
    }
    
    // ================Administrator Functions================
    function addAdmin(address _address) public onlyGlobalAdmin {
        admins[_address] = true;
    }

    function removeAdmin(address _address) public onlyGlobalAdmin {
        delete admins[_address];
    }

    /**
      * Get the address of a internal contract.
      *
      * @param _guid Unique identifier.
      * @return Contract address.
      */
    function getAddressByID(string memory _guid) public view returns (address) {
        return contractAddresses[getKey(_guid)];
    }

    /**
      * Derives an unique key from a identifier to be used in the global mapping contractAddresses.
      *
      * This is necessary due to tx identifiers are of type string
      * which cannot be used as dictionary keys.
      *
      * @param _guid The unique certificate identifier.
      * @return The key derived from certificate identifier.
      */
    function getKey(string memory _guid) public pure returns (bytes32) {
        return sha256(abi.encodePacked(_guid));
    }

    // ================Modifiers================
    modifier onlyGlobalAdmin() {
        require(msg.sender == globalAdmin);
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender]);
        _;
    }
}