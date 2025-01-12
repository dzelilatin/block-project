// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
    }

    // Mappings to satisfy project requirements 
    mapping(uint256 => Campaign) public campaigns;
    mapping(address => uint256) public donorBalances;

    uint256 public numberOfCampaigns = 0;

    // Events to satisfy project requirements 
    event CampaignCreated(uint256 id, address owner, uint256 target, uint256 deadline);
    event DonationReceived(uint256 id, address donator, uint256 amount);
    event FundsWithdrawn(uint256 id, address owner, uint256 amount);

    // Modifiers
    modifier onlyOwner(uint256 _id) {
        require(msg.sender == campaigns[_id].owner, "Not the owner of this campaign");
        _;
    }

    modifier validDonation(uint256 _id) {
        require(campaigns[_id].deadline > block.timestamp, "Campaign has ended");
        require(msg.value > 0, "Donation must be greater than zero");
        _;
    }

    function createCampaign(
        address _owner,
        string memory _title, 
        string memory _description, 
        uint256 _target, 
        uint256 _deadline) public returns (uint256) { require(_deadline < block.timestamp, "The deadline must be a date in the future.");

        Campaign storage campaign = campaigns[numberOfCampaigns];

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;

        emit CampaignCreated(numberOfCampaigns, _owner, _target, _deadline);

        numberOfCampaigns++;

        return numberOfCampaigns - 1;  // so it returns the actual length of campaign. 
    }

    function donateToCampaign(uint256 _id) public payable validDonation(_id) {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        donorBalances[msg.sender] += amount;

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        if (sent) {
            campaign.amountCollected += amount;
            emit DonationReceived(_id, msg.sender, amount);
        }
    }

    function withdrawFunds(uint256 _id) public onlyOwner(_id) {
        Campaign storage campaign = campaigns[_id];

        require(campaign.amountCollected >= campaign.target, "Target not reached yet");

        uint256 amount = campaign.amountCollected;
        campaign.amountCollected = 0;

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        require(sent, "Failed to send funds");

        emit FundsWithdrawn(_id, campaign.owner, amount);
    }

// returns address and amount donated of donator 
    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

//gets all campaigns that a user created
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns); //keeps track of number of campaigns created

        for(uint i = 0; i<numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item; 
        }
    
    return allCampaigns;
    }
}