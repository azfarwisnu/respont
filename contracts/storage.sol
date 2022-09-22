// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract MessageStorage {
    struct MessageStruct{
        address FromAddress;
        address ToAddress;
        string MessageText;
        string[] MediaLink;
        uint MessageTimestamp;
        uint BlockHeight;
    }

    struct OpponentStruct{
        address Opponent;
        MessageStruct Messages;
    }

    struct Profile{
        address Owner;
        string Picture;
        address[] Opponents;
    }

    mapping(address => MessageStruct[]) private MessageDetail;
    Profile private StorageProfile;

    constructor(address _Owner){
        StorageProfile.Owner = _Owner;
    }

    function Opponents() public view returns(OpponentStruct[] memory){
        require(msg.sender == StorageProfile.Owner, "You are not the Owner");

        OpponentStruct[] memory OpponentList = new OpponentStruct[](StorageProfile.Opponents.length);

        for(uint i = 0; i < StorageProfile.Opponents.length; i++){
            uint MessageLength = MessageDetail[StorageProfile.Opponents[i]].length;
            OpponentList[i] = OpponentStruct(StorageProfile.Opponents[i], MessageDetail[StorageProfile.Opponents[i]][MessageLength - 1]);
        }

        return OpponentList;
    }

    function Opponent(address _Opponent) public view returns(OpponentStruct memory){
        require(msg.sender == StorageProfile.Owner, "You are not the Owner");
        require(_Opponent != msg.sender, "Invalid data");

        uint MessageLength = MessageDetail[_Opponent].length;
        return OpponentStruct(_Opponent, MessageDetail[_Opponent][MessageLength - 1]);
    }

    function Message(address _Opponent) public view returns(MessageStruct[] memory){
        require(msg.sender == StorageProfile.Owner && _Opponent != StorageProfile.Owner, "You are not owner");
        require(_Opponent != StorageProfile.Owner, "Invalid data");

        return MessageDetail[_Opponent];
    }

    function GetPicture() public view returns(string memory){
        return StorageProfile.Picture;
    }

    function ChangePicture(string memory _MediaLink) public{
        require(msg.sender == StorageProfile.Owner, "You are not the Owner");

        StorageProfile.Picture = _MediaLink;
    }

    function NewMessage(address _FromAddress, address _ToAddress, string memory _MessageText, string[] memory _MediaLink) public{
        require(_FromAddress == StorageProfile.Owner || _ToAddress == StorageProfile.Owner, "You are not the Owner");
        require(_FromAddress != _ToAddress, "Invalid data");

        address OpponentAddress;

        if(_FromAddress != StorageProfile.Owner){
            OpponentAddress = _FromAddress;
        }else{
            OpponentAddress = _ToAddress;
        }

        if(MessageDetail[OpponentAddress].length == 0){
            StorageProfile.Opponents.push(OpponentAddress);
        }

        MessageDetail[OpponentAddress].push(MessageStruct(_FromAddress, _ToAddress, _MessageText, _MediaLink, block.timestamp, block.number));
    }
}