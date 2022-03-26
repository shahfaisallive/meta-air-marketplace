
const EngToken = artifacts.require("EngToken");
const NFTMarketPlace = artifacts.require("NFTMarketPlace");
const NFT = artifacts.require("NFT");


module.exports =  async function (deployer) {
  
  // await deployer.deploy(EngToken);
  // const token = await EngToken.deployed()
  await deployer.deploy(NFTMarketPlace);
  const market = await NFTMarketPlace.deployed()
  await deployer.deploy(NFT,market.address);
}