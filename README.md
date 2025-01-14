Blockchain-Based Crowdfunding Platform

This project is a decentralized crowdfunding platform built on the Ethereum blockchain. It allows users to create campaigns, donate to campaigns, and track progress transparently using smart contracts. The platform is designed to provide a trustless and secure environment for fundraisers and donors.

Features

Campaign Creation: Users can create campaigns by specifying a title, description, funding goal, and deadline.
Donation System: Users can donate to campaigns directly through the platform, and all transactions are recorded on the blockchain.
Transparency: Campaign progress, donation details, and deadlines are visible to all users.
Wallet Integration: Connects to Ethereum wallets such as MetaMask for seamless transactions.
Decentralized Logic: Uses Solidity smart contracts to handle campaign creation, donations, and fund withdrawals.

Tech Stack

Frontend: React.js, Tailwind CSS
Backend: Solidity (Smart Contracts)
Blockchain: Ethereum (Testnet: Sepolia)
Tools: Web3.js, Ethers.js, Web3Modal

Installation and Setup

Clone the Repository:
git clone https://github.com/dzelilatin/block-project.git
cd block-project
Install Dependencies:
npm install
Configure Environment:
Set up an Ethereum provider (e.g., Alchemy or Infura) and add the endpoint in the code.
Update the smart contract address and ABI in the constants.js file.
Run the Application:
npm start
Deploy the Smart Contract:
Install Hardhat:
npm install --save-dev hardhat
Compile and deploy the smart contract using the Hardhat or Remix IDE.
Copy the deployed contract address and ABI to your frontend.

Usage

Connect Wallet: Use MetaMask or any Ethereum wallet to connect to the platform.
Create a Campaign:
Fill out the campaign form with title, description, target amount, and deadline.
Submit the form to create a campaign on the blockchain.
Donate to Campaigns:
Browse active campaigns and select one to donate to.
Enter the donation amount and confirm the transaction via MetaMask.
Track Progress:
View the campaign details, including the target, amount raised, and days left.

Smart Contract Overview

The platform's functionality is powered by the following smart contract:

CrowdFunding.sol
Campaign Structure: Defines the attributes of a campaign (owner, title, target, deadline, donations, etc.).
Functions:
createCampaign: Creates a new campaign.
donateToCampaign: Allows users to donate to a specific campaign.
getCampaigns: Fetches all active campaigns.
withdrawFunds: Enables campaign owners to withdraw funds if the target is met.
getDonators: Retrieves the list of donors and their contributions.

This project is licensed under the MIT License.

Screenshots
[Optional] Add screenshots or GIFs of the application in action.


Feel free to enhance and customize the platform as per your requirements. 🚀