const hre = require("hardhat");
//0x39fAB77c344499aa1AD5cB3De033B8fE60c481e8
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Assuming CrowdFunding is the name of your contract
  const CrowdFunding = await ethers.getContractFactory("CrowdFunding");

  console.log("Deploying the contract...");
  const crowdFunding = await CrowdFunding.deploy();

  console.log("CrowdFunding contract deployed to:", CrowdFunding.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });