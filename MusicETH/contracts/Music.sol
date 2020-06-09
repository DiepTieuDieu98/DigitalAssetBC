pragma solidity >=0.4.21 <0.7.0;

import "./Ownable.sol";

contract Music is Ownable {
    string public guid;
    string public name;
    string public email;
    string public fullAddress;
    string public phoneNumber;
    string public taxCode;
    string public registrationCode;
    string public goodPractices;

    constructor(
        string memory _guid,
        string memory _name,
        string memory _address,
        string memory _phoneNumber,
        string memory _taxCode,
        string memory _registrationCode,
        address masterContractOwner)
        public
    {
        guid = _guid;
        name = _name;
        fullAddress = _address;
        phoneNumber = _phoneNumber;
        taxCode = _taxCode;
        registrationCode = _registrationCode;

        Ownable.transferOwnership(masterContractOwner);
    }

    function updateMusicInformation(
        string memory _name,
        string memory _email,
        string memory _address,
        string memory _phoneNumber,
        string memory _taxCode,
        string memory _registrationCode,
        string memory _goodPractices)
        public
        onlyOwner
    {
        name = _name;
        email = _email;
        fullAddress = _address;
        phoneNumber = _phoneNumber;
        taxCode = _taxCode;
        registrationCode = _registrationCode;
        goodPractices = _goodPractices;
    }

    function selfDelete() public onlyOwner
    {
        selfdestruct(msg.sender);
    }
}
