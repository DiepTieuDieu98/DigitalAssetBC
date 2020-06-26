pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";

contract MusicAssetTransfer is Ownable {

    enum TransactType { NotAvailable, ForSale, Regeneration, CopyProduct,  Distribution, ForOnline, ToRent}
    enum FanType { NotAvailable, Buyer, Listener, Singer }
    
    string public guid;
    string public musicAssetId;
    string public fromOwnerId;
    string public toFanId;
    uint public quantity;
    uint public dateTransferred;
    TransactType public tranType;
    FanType public fanType;
    bool public isPermanent;
    uint public dateStart;
    uint public dateEnd;
    bool public isConfirmed;

    constructor() public
    {
    }
    
    function addMusicAssetTransfer(
        string[4] memory transactInfo,
        uint[6] memory transacInfoInt,
        bool[2] memory transactInfoCheck,
        address masterContractOwner)
        public
        onlyOwner
    {
        guid = transactInfo[0];
        musicAssetId = transactInfo[1];
        fromOwnerId = transactInfo[2];
        toFanId = transactInfo[3];
        dateTransferred = transacInfoInt[0];
        tranType = TransactType(transacInfoInt[1]);
        fanType = FanType(transacInfoInt[2]);
        dateStart = transacInfoInt[3];
        dateEnd = transacInfoInt[4];
        isPermanent = transactInfoCheck[0];
        isConfirmed = transactInfoCheck[1];

        Ownable.transferOwnership(masterContractOwner);
    }

    function updateMusicAssetTransfer(
        string memory _musicAssetId,
        string memory _fromOwnerId,
        string memory _toFanId,
        uint8 _fanType,
        uint _dateTransferred,
        bool _isConfirmed)
        public
        onlyOwner
    {
        musicAssetId = _musicAssetId;
        fromOwnerId = _fromOwnerId;
        toFanId = _toFanId;
        fanType = FanType(_fanType);
        dateTransferred = _dateTransferred;

        isConfirmed = _isConfirmed;
    }

    function selfDelete() public onlyOwner
    {
        selfdestruct(msg.sender);
    }
}