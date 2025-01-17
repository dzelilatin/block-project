import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { JsonRpcProvider, BrowserProvider, Contract, parseUnits, parseEther, formatEther } from "ethers";




// INTERNAL IMPORT
import { CrowdFundingABI, CrowdFundingAddress } from "./contants";

// FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);

export const CrowdFundingContext = React.createContext();
export const CrowdFundingProvider = ({ children }) => {
  const titleData = "Crowd Funding Contract";
  const [currentAccount, setCurrentAccount] = useState("");

  const createCampaign = async (campaign) => {
    const { title, description, amount, deadline } = campaign;
    const web3Modal = new Web3Modal();
    
    try {
      // Connect to wallet
      const connection = await web3Modal.connect();
      const provider = new BrowserProvider(connection);
      
      // Get the signer
      const signer = await provider.getSigner();
      
      // Fetch the contract with the signer
      const contract = fetchContract(signer);
  
      console.log(currentAccount);
      
      // Call the contract function
      const transaction = await contract.createCampaign(
        currentAccount, // owner
        title,
        description,
        parseUnits(amount, 18), // Updated
        Math.floor(new Date(deadline).getTime() / 1000) // Deadline in seconds
      );
  
      await transaction.wait();
  
      console.log("Contract call success", transaction);
    } catch (error) {
      console.log("Contract call failure", error);
    }
  };
  

  const getCampaigns = async () => {
    const provider = new JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/scRVbR8zRCengDHOAjBcQdJ2N5DfR2nl"); 
    const contract = fetchContract(provider);
  
    const campaigns = await contract.getCampaigns();
    if (!campaigns || campaigns.length === 0) {
      console.log("No campaigns found.");
      return [];
    }
  
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: formatEther(campaign.target.toString()),
      deadline: new Date(campaign.deadline.toNumber() * 1000), // Convert deadline
      amountCollected: formatEther(campaign.amountCollected.toString()),
      pId: i,
    }));
  
    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const provider = new JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/scRVbR8zRCengDHOAjBcQdJ2N5DfR2nl");
    const contract = fetchContract(provider);

    const allCampaigns = await contract.getCampaigns();
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    const currentUser = accounts[0];

    // Filter campaigns by owner
    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === currentUser
    );

    const userData = filteredCampaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: utils.formatEther(
        campaign.amountCollected.toString()
        ),
      pId: i,
    }));

    return userData;
  };

  const donate = async (pId, amount) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new BrowserProvider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const campaignData = await contract.donateToCampaign(pId, {
      value: parseEther(amount), // Updated
    });

    await campaignData.wait();
    location.reload();

    return campaignData;
  };

  const getDonations = async (pId) => {
    const provider = new JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/scRVbR8zRCengDHOAjBcQdJ2N5DfR2nl"); 
    const contract = fetchContract(provider);

    const donations = await contract.getDonations(pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: utils.formatEther(donations[1][i].toString()), 
      });
    }

    return parsedDonations;
  };

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return console.log("Install Metamask");
  
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
  
      if (accounts.length) {
        setCurrentAccount(accounts[0]); // Correctly set the current account
      } else {
        console.log("No account found.");
      }
    } catch (error) {
      console.log("Error while connecting wallet", error);
    }
  };  

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return console.log("Install Metamask");
  
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error occurred while connecting to wallet.");
    }
  };
  

  return (
    <CrowdFundingContext.Provider
      value={{
        titleData,
        currentAccount,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        connectWallet,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
