// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DashboardData is Ownable {
    struct DailyData {
        uint256 activeUsers;
        uint256 transactionVolume;
    }

    mapping(uint256 => DailyData) public dailyData;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function updateDailyData(uint256 date, uint256 _activeUsers, uint256 _transactionVolume) public onlyOwner {
        dailyData[date] = DailyData(_activeUsers, _transactionVolume);
    }

    function getDailyData(uint256 date) public view returns (uint256, uint256) {
        DailyData memory data = dailyData[date];
        return (data.activeUsers, data.transactionVolume);
    }
}
