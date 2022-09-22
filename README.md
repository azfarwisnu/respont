# RESPONT
## Summary
Respont is a messaging app built on blockchain technology so that it is decentralized.

Respont works by storing messages in a storage where it becomes like a "phone number" which will be a storage place such as profile data, messages and others and the data can only be accessed by the owner who made the storage for crucial data.

Respont currently works without an encryption system for our MVP modal. However, one day we will definitely implement the system because it becomes very crucial and important for user privacy.

Respont can run across a wide variety of protocols, and is currently under construction at Polygon Mumbai testnet.

### TABLE OF CONTENT
- [Parts](#components)
- [Technology](#technology)
- [Installation](#installation)

## Components
In this repository there are various components needed, including:
1. Front-end with ReactJS
components that will interact directly with the user through the browser. It's in the `src` folder.
2. Back-end with ExpressJS
component to perform 'temporary storage' for uploading to IPFS. It's in the `backend` folder.
3. Smart contracts with Solidity
The component that resides on the network protocol currently resides on the Polygon Mumbai Testnet. It's in `contracts` folder.

## Technology
Respont works on a decentralized based system built on blockchain with Polygon Mumbai testnet as the protocol. The way it works is by using storage for each user as a place where everything about that user is stored and only accessed by that user for crucial data.

Respont currently works without an encryption system for our MVP modal. However, one day we will definitely implement the system because it becomes very crucial and important for user privacy.

For media attachment storage, we use the InterPlanetary File System (IPFS) system provided by Infura.

Here is a brief description of how the smart contract response works in sending messages:
![Smart Contract Flowchart](https://i.ibb.co/wKRSbk1/Untitled-Diagram.jpg)

## Installation
### Front End

1. You have to deploy the smart contract to the protocol. You can use truffl or remix.
2. Before installing on the back-end and front-end you need to install NodeJS on your server/PC
3. You need to do the installation on the backend. By going to the `backend` folder and typing the command
```
npm i
```
Then it can be run with the command
```
nodemon app.js
```
4. Then you also need a front-end as a place to integrate all that with the browser. However, first you need to install the packages required by React which is done in the main folder using the command
```
npm i
```
5. If the installation went without errors you can then run React with the command
```
npm start
```
4. Then you can change some variables with the settings you did when running back-end and solidity in the `src/contants/API.js` file.
5. Then don't forget to also create an .env file in the backend folder whose contents are
```
projectID = <INFURA_IPFS_PROJECT_ID>
projectSecret = <INFURA_IPFS_PROJECT_SECRET>
infuraDomain = <INFURA_IPFS_SUBDOMAIN>
```
6. Then you can access the front-end on `http://localhost:3000`
