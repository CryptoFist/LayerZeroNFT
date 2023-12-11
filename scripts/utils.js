const { ethers, network } = require("hardhat");
const { lzEndPoint_abi } = require("../external_abi/lzEndPoint.abi.json");
const { deploy, getContract } = require("hardhat-libutils");
const { getDeploymentParam } = require("./params");

async function setTrustedRemoteAddress() {
    let [deployer] = await ethers.getSigners();
    console.log(
        "Setting TrustedRemoteAddress with account: ",
        deployer.address
    );

    let param = getDeploymentParam();
    let dstChainId = param.dstChainId;

    if (network.name == "fuji") {
        layerZeroNFT_src = await getContract(
            "LayerZeroNFT",
            "LayerZeroNFT",
            "fuji"
        );
        layerZeroNFT_dst = await getContract(
            "LayerZeroNFT",
            "LayerZeroNFT",
            "goerli"
        );
    } else {
        layerZeroNFT_src = await getContract(
            "LayerZeroNFT",
            "LayerZeroNFT",
            "goerli"
        );
        layerZeroNFT_dst = await getContract(
            "LayerZeroNFT",
            "LayerZeroNFT",
            "fuji"
        );
    }

    let tx = await layerZeroNFT_src.setTrustedRemoteAddress(
        dstChainId,
        layerZeroNFT_dst.address
    );

    await tx.wait();

    console.log("Done successfully!");
}

async function mintNFT() {
    let [deployer] = await ethers.getSigners();
    console.log("Minting NFT with account: ", deployer.address);

    let layerZeroNFT = await getContract("LayerZeroNFT", "LayerZeroNFT");
    let tx = await layerZeroNFT.mintNFT();
    await tx.wait();

    console.log("Done successfully!");
}

async function setMinDstGas() {
    console.log("setMinDstGas");
    let layerZeroNFT = await getContract("LayerZeroNFT", "LayerZeroNFT");
    let param = getDeploymentParam();
    let dstChainId = param.dstChainId;
    await layerZeroNFT.setMinDstGas(
        dstChainId,
        1,
        BigInt(param.minGasToTransfer)
    );
    console.log("done");
}

async function bridgeNFT() {
    let [deployer] = await ethers.getSigners();
    console.log("SendFrom NFT with account: ", deployer.address);

    const defaultAdapterParams = ethers.utils.solidityPack(
        ["uint16", "uint256"],
        [1, 200000]
    );

    let param = getDeploymentParam();
    let layerZeroNFT = await getContract("LayerZeroNFT", "LayerZeroNFT");
    let dstChainId = param.dstChainId;
    let tokenId = (await layerZeroNFT.tokenId()) - 1;
    console.log("tokenId: ", tokenId);

    let tx = await layerZeroNFT.approve(layerZeroNFT.address, tokenId);
    await tx.wait();

    let nativeFee = (
        await layerZeroNFT.estimateSendFee(
            dstChainId,
            deployer.address,
            tokenId,
            false,
            defaultAdapterParams
        )
    ).nativeFee;
    console.log("nativeFee: ", nativeFee);

    tx = await layerZeroNFT.sendFrom(
        deployer.address,
        dstChainId,
        deployer.address,
        tokenId,
        deployer.address,
        ethers.constants.AddressZero,
        defaultAdapterParams,
        { value: nativeFee }
    );
    await tx.wait();

    console.log("done");
}

async function getBasicInfo() {
    let layerZeroNFT = await getContract("LayerZeroNFT", "LayerZeroNFT");
    console.log(await layerZeroNFT.brigedCount());
}

async function process() {
    await mintNFT();
    await bridgeNFT();
}

async function main() {
    // await getBasicInfo();
    // await setMinDstGas();
    // await setTrustedRemoteAddress();
    await process();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
