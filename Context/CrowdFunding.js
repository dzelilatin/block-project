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
    const connection = await web3Modal.connect();
    const provider = new BrowserProvider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    console.log(currentAccount);
    try {
      const transaction = await contract.createCampaign(
        currentAccount, // owner
        title,
        description,
        parseUnits(amount, 18), // Updated
        new Date(deadline).getTime()
      );

      await transaction.wait();

      console.log("contract call success", transaction);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    const provider = new JsonRpcProvider("http://127.0.0.1:8545"); 
    const contract = fetchContract(provider);

    const campaigns = await contract.getCampaigns();
    if (!campaigns || campaigns.length === 0) {
        console.log("No campaigns found.");
        return [];
      }

    // Parse campaigns data
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: utils.formatEther(campaign.target.toString()), 
      deadline: campaign.deadline.toNumber(),
      amountCollected: utils.formatEther(campaign.amountCollected.toString()),
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const provider = new JsonRpcProvider("http://127.0.0.1:8545"); 
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
    const provider = new JsonRpcProvider("http://127.0.0.1:8545"); 
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
      if (!window.ethereum)
        return console.log("Install Metamask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No account found.");
      }
    } catch (error) {
      console.log("Something went wrong while trying to connect to your wallet.");
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
