require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
      {
        version: "0.8.20",
      },
      {
        version: "0.8.27",
      },
    ],
  },
  networks: {
    linea: {
      url: process.env.LINEA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
