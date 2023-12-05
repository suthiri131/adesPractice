import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js/auto';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function RevenueChart() {
  const [revenues, setRevenues] = useState(null);
  let labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  let amounts = [];

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/admin/stats/revenuepermonth');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        console.log('Fetched data:', data.statistics.rows);
        setRevenues(data.statistics.rows);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    fetchStatistics();
  }, []);

  console.log('revenues', revenues);

  if (revenues) {
    const revenueByMonth = {};

    labels.forEach((month) => {
      revenueByMonth[month] = 0;
    });

    revenues.forEach((revenue) => {
      const monthName = new Date(revenue.month + '-01').toLocaleString(
        'en-US',
        { month: 'long' }
      );
      revenueByMonth[monthName] = revenue.sum;
    });

    amounts = labels.map((month) => revenueByMonth[month]);
  }

  const options = {
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'category', // Use 'category' type for X scale
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
        },
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Revenue',
        data: amounts,
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        borderColor: 'rgba(0, 0, 255, 1.0)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-orange-100 rounded-lg p-5 w-100">
      <h4 className="text-2xl font-bold mb-6 text-center">
        Revenue (By Month)
      </h4>
      <Line options={options} data={data} />
    </div>
  );
}
