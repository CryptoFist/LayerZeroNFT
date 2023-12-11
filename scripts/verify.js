const { ethers } = require("hardhat");
const { deploy, getContract, verify } = require("hardhat-libutils");
const { getDeploymentParam } = require("./params");

async function main() {
    let [deployer] = await ethers.getSigners();
    console.log("Verifying contract with account: ", deployer.address);
    let param = getDeploymentParam();

    let layerZeroNFT = await getContract("LayerZeroNFT", "LayerZeroNFT");

    await verify(layerZeroNFT.address, [
        "OmniNFT",
        "ONFT",
        BigInt(param.minGasToTransfer),
        param.lzEndPoint,
    ]);

    console.log("Verified successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
