import React, {useState, useEffect} from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers"; 

//INTERNAL IMPORT
import { CrowdFundingABI, CrowdFundingAddress } from "./contants";
// import { parse } from "next/dist/build/swc/generated-native";

//FETCHING SMART CONTRACT

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);

export const CrowdFundingContext = React.createContext();
export const CrowdFundingProvider = ({ children }) => {
    const titleData = "Crowd Funding Contract";
    const [currentAccount, setCurrentAccount] = useState("");

    const createCampaign = async (campaign) => {
        const {title, desription, amount, deadline} = campaign; //we send data into this function in form of object, we get all data from campaign 
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);
        
        console.log(currentAccount);
        try {
            const transaction = await contract.createCampaign(
                currentAccount, //owner
                title, 
                description,
                ethers.util.parseUnits(amount, 18),
                new Date(deadline).getTime()
            );
            
            await transaction.wait(); 
            
            console.log("contract call success", transaction);
        } catch(error) {
            console.log("contract call failure", error);
        }
    }

    const getCampaigns = async () => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const campaigns = await contract.getCampaigns();

        //in form of array will this data come from campaign function 
        const parsedCampaigns = campaigns.map((campaign, i) => ({ 
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            targer: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(
                campaign.amountCollected.toString()),
            pId: i
        }));

        return parsedCampaigns; //will return entire data in form of array in an organized way
    };

    const getUserCampaigns = async() => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const allCampaigns = await contract.getCampaigns(); //get all camp. in form of array 

        const accounts = await window.ethereum.request( {
            method: "eth_accounts", // get acc of that particular user 
        });
        const currentUser = accounts[0]; // get first acc 

        //get only campaigns which that user has creted
        const filteredCampaigns = allCampaigns.filter (
            (campaign) =>
              campaign.owner === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              ); 
        
        const userData = filteredCampaigns.map((campaign, i) => ({
            owner: campaign.owner, 
            title: campaign.title, 
            description: campaign.description,
            target: ethers.utils.formatEther (campaign.target.toString()), 
            deadline: campaign.deadline.toNumber(), 
            amountCollected: ethers.utils.formatEther(
                campaign.amountCollected.toString()
            ),
            pId: i,
        }));

        return userData;
    };

    const donate = async (pId, amount) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner(); 
        const contract = fetchContract(signer);

        const campaignData = await contract.donateToCampaign(pId, {
            value: ethers.util.parseEther(amount),
        });

        await campaignData.wait();
        location.reload();

        return campaignData;
    };

    const getDonations = async (pId) => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const donations = await contract.getDonations(pId);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push( {
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString()),
            });
        }

        return parsedDonations;
    };

    //CHECK IF WALLET IS CONNECTED OR NOT 

    const checkIfWalletConnected = async () => {
        try {
            if (!window.ethereum)
              return setOpenError(true), setError("Install Metamask");

            const accounts = await window.ethereum.request ({
                method: "eth_accounts",
            });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log("No account found.");
            } 
        } catch (error) {
            console.log("Something weent wrong while trying to connect to your wallet.");
        }
    };

    useEffect(() => {
        checkIfWalletConnected();
    }, []);
    
    // CONNECT WALLET FUNCTION

    const connectWallet = async () => {
        try {
            if (!window.ethereum) return console.log("Install Metamask");

        const accounts = await window.ethereum.request({
            method: "eth_requstAccounts",
        });
        setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log("Error occured while connecting to wallet.")
        }
    };

    return (
        <CrowdFundingContext.Provider
        value = {{
            titleData,
            currentAccount,
            createCampaign,
            getCampaigns,
            donate,
            getDonations,
            connectWallet
        }}
    >
         {children}
    </CrowdFundingContext.Provider>
    );
};



    