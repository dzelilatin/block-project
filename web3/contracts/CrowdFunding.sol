// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;

    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(campaign.deadline < block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1; // bcs this will be the index of the most recent created campaign

    } 

    //only one parameter bcs we take id of the campaign we want to donate to
    function donateToCampaign(uint256 _id) public payable { 
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id]; // to je mapping koji smo gore napravili u liniji 21

        campaign.donators.push(msg.sender); //pushamo donatora kao donatora 
        campaign.donations.push(amount);  

        // tell us if transaction is sent or not 
        (bool sent,) = payable(campaign.owner).call{value: amount}(""); //we re sending it to the owner of campaign, payable returns 2 diff
        // things but now we're accessing just one so we add ',' to let solidity know that something might come afterward 

        if(sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory,uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations); 
    }
    //moramo znati iz koje kampanje zelimo donatore da bi dobili te konkretne donatore
    // i zato stavimo kao parametar campaign id
    // view funkcija jer samo ce vratiti neku datu da bi bili able to view it, returns an address in memory (smthn we stored before) rather than array of add. 
    // znaci vraca address[] donators; i uint256[] donations;

    function getCampaigns() public view returns (Campaign[] memory) { //no params bcs we want to get all campaigns, array of campaigns from mem
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

    //we are creating new variable allCapamigns of a type array of multiple campaign structures, we arent getting campaigns, we are creating
    // an empty array with as many empty elements as there are actual campaigns (number of camp.) [{}, {}, {}]

        //loop thr all of the campaigns and populate that variable
        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item; // fetching that specif. campaign from storage and populating it to allCampaigns 
        }
    
        return allCampaigns;
    }  
} 