import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const contractABI = [
  "function getDailyData(uint256 date) public view returns (uint256, uint256)",
  "function updateDailyData(uint256 date, uint256 _activeUsers, uint256 _transactionVolume) public"
];

const contractAddress = "0xE622cF350D48D48D0be809D9492339cbC6b98A71";

function App() {
  const [dailyActiveUsers, setDailyActiveUsers] = useState([]);
  const [transactionVolume, setTransactionVolume] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_LINEA_RPC_URL);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
  
      const today = Math.floor(Date.now() / 86400000);
      const daysToFetch = 7;
  
      const results = await Promise.all(
        Array.from({ length: daysToFetch }, (_, i) => 
          contract.getDailyData(today - i)
            .catch(err => {
              console.error(`Error fetching data for day ${i}:`, err);
              return null;
            })
        )
      );
  
      const processedData = results
        .filter(result => result !== null)
        .map((result, index) => ({
          date: new Date(Date.now() - index * 86400000).toLocaleDateString(),
          activeUsers: result[0].toNumber(),
          volume: parseFloat(ethers.formatEther(result[1]))
        }));
  
      setDailyActiveUsers(processedData.map(({ date, activeUsers }) => ({ date, count: activeUsers })).reverse());
      setTransactionVolume(processedData.map(({ date, volume }) => ({ date, volume })).reverse());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const dailyActiveUsersChart = {
    labels: dailyActiveUsers.map(d => d.date),
    datasets: [
      {
        label: 'Daily Active Users',
        data: dailyActiveUsers.map(d => d.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const transactionVolumeChart = {
    labels: transactionVolume.map(d => d.date),
    datasets: [
      {
        label: 'Transaction Volume (ETH)',
        data: transactionVolume.map(d => parseFloat(d.volume)),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard">
      <h1>Linea Ecosystem Data Analytics Dashboard</h1>
      
      <div className="chart">
        <h2>Daily Active Users</h2>
        <Line data={dailyActiveUsersChart} />
      </div>
      
      <div className="chart">
        <h2>Transaction Volume</h2>
        <Line data={transactionVolumeChart} />
      </div>
    </div>
  );
}

export default App;
