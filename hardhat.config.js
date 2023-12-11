/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-contract-sizer");
require("solidity-coverage");
require("dotenv").config();

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
            chainId: 5,
            accounts: [process.env.DEPLOYER_WALLET],
        },
        fuji: {
            url: "https://api.avax-test.network/ext/bc/C/rpc",
            chainId: 43113,
            accounts: [process.env.DEPLOYER_WALLET],
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.20",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 2000,
                    },
                },
            },
            {
                version: "0.8.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 2000,
                    },
                },
            },
        ],
    },
    etherscan: {
        apiKey: {
            goerli: process.env.ETH_API_KEY,
            avalancheFujiTestnet: process.env.AVAX_API_KEY,
        },
    },

    mocha: {
        timeout: 2000000,
    },
};
