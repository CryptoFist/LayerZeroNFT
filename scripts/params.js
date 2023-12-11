const { network, ethers } = require("hardhat");

const DEPLOYMENT_PARAM = {
    goerli: {
        lzEndPoint: "0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23",
        minGasToTransfer: 150000,
        dstChainId: 10106,
    },
    fuji: {
        lzEndPoint: "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706",
        minGasToTransfer: 150000,
        dstChainId: 10121,
    },
};

const getDeploymentParam = () => {
    if (network.name == "goerli") {
        return DEPLOYMENT_PARAM.goerli;
    } else if (network.name == "fuji") {
        return DEPLOYMENT_PARAM.fuji;
    } else {
        return {};
    }
};

module.exports = {
    getDeploymentParam,
};
