
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement, // Import BarElement
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2'; // Import Bar instead of Line

export default function BarChart({ labels, counts, color, title, legend }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement, // Register BarElement
    Title,
    Tooltip,
    Legend
  );

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
        label: legend,
        data: counts,
        backgroundColor: 'rgba(0,0,255,1.0)',
        borderColor: 'rgba(0,0,255)',
      },
    ],
  };

  return (
    <div className={`${color} rounded-lg p-5 w-100`}>
      <h4 className="text-2xl font-bold mb-6 text-center">{title}</h4>
      <Bar options={options} data={data} />
    </div>
  );
}
