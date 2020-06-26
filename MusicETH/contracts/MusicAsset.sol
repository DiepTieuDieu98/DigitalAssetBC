pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";

contract MusicAsset is Ownable {
    
    enum CreatureType { NotAvailable, Lyrics, Audio, MV}
    enum OwnerType { NotAvailable, Composer, SongWriter }
    
    string public guid;
    string public name;
    string public title;
    string public album;
    string public publishingYear;
    uint public ownerId;
    string public licenceLink;
    string public musicLink;
    CreatureType public creatureType;
    OwnerType public ownerType;

    constructor() public
    {
        
    }
    
    function addMusicInformation(
        string[5] memory stringInfo,
        string[2] memory stringLink,
        uint[4] memory intId,
        address masterContractOwner)
        public
        onlyOwner
    {
        guid = stringInfo[0];
        name = stringInfo[1];
        title = stringInfo[2];
        album = stringInfo[3];
        publishingYear = stringInfo[4];
        ownerId = intId[0];
        licenceLink = stringLink[0];
        musicLink = stringLink[1];
        creatureType = CreatureType(intId[1]);
        ownerType = OwnerType(intId[2]);

        transferOwnership(masterContractOwner);
    }
    

    function updateMusicInformation(
        string memory _name,
        string memory _title,
        string memory _album,
        string memory _publishingYear,
        uint _ownerId,
        string memory _licenceLink,
        string memory _musicLink,
        uint8 _creatureType,
        uint8 _ownerType)
        public
        onlyOwner
    {
        name = _name;
        title = _title;
        album = _album;
        publishingYear = _publishingYear;
        ownerId = _ownerId;
        licenceLink = _licenceLink;
        musicLink = _musicLink;
        creatureType = CreatureType(_creatureType);
        ownerType = OwnerType(_ownerType);
    }

    function selfDelete() public onlyOwner
    {
        selfdestruct(msg.sender);
    }
}