// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./storage.sol";

contract Factory{
    struct StorageStruct{
        address Owner;
        address Storage;
    }

    StorageStruct[] private StorageOwner;
    mapping(address => address) private GetStorage;

    event Deployed(MessageStorage indexed _Storage, address indexed _Owner);
    event Sent(address indexed _Sender, address indexed _Receiver);

    function Storage() public view returns(address){
        return GetStorage[msg.sender];
    }
    
    function DeployStorage() public{
        require(address(GetStorage[msg.sender]) == address(0), "Duplicate Storage");
        
        MessageStorage Deploy = new MessageStorage(msg.sender);
        StorageOwner.push(StorageStruct(msg.sender, address(Deploy)));

        GetStorage[msg.sender] = address(Deploy);

        emit Deployed(Deploy, msg.sender);
    }

    function SendMessage(address _ToAddress, string memory _MessageText, string[] memory _MediaLink) public{
        address ContractSender = address(GetStorage[msg.sender]);
        address ContractReceiver = address(GetStorage[_ToAddress]);

        require(ContractSender != address(0) && ContractReceiver != address(0), "One of addresses do not have storage");

        MessageStorage(ContractSender).NewMessage(msg.sender, _ToAddress, _MessageText, _MediaLink);
        MessageStorage(ContractReceiver).NewMessage(msg.sender, _ToAddress, _MessageText, _MediaLink);

        emit Sent(msg.sender, _ToAddress);
    }
}