const { ethers } = require("hardhat");
const { deploy } = require("hardhat-libutils");
const { getDeploymentParam } = require("./params");

async function main() {
    let [deployer] = await ethers.getSigners();
    console.log("Deploying contract with account: ", deployer.address);
    let param = getDeploymentParam();

    await deploy(
        "LayerZeroNFT",
        "LayerZeroNFT",
        "OmniNFT",
        "ONFT",
        BigInt(param.minGasToTransfer),
        param.lzEndPoint
    );

    console.log("Deployed successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
