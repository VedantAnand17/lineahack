const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const DashboardData = await hre.ethers.getContractFactory("DashboardData");
  const dashboardData = await DashboardData.deploy(deployer.address);

  await dashboardData.waitForDeployment();

  console.log("DashboardData deployed to:", await dashboardData.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
