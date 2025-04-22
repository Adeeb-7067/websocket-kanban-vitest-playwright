import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProgressChart = ({ tasks }) => {
  const columns = ['To Do', 'In Progress', 'Done'];
  const taskCounts = columns.map(column => 
    tasks.filter(task => task.column === column).length
  );

  const completionPercentage = tasks.length > 0
    ? Math.round((taskCounts[2] / tasks.length) * 100)
    : 0;

  const data = {
    labels: columns,
    datasets: [
      {
        label: 'Number of Tasks',
        data: taskCounts,
        backgroundColor: [
          'rgba(255, 154, 122, 0.5)', // peach
          'rgba(134, 239, 172, 0.5)', // light green
          'rgba(74, 222, 128, 0.5)'   // green
        ],
        borderColor: [
          'rgb(255, 154, 122)', // peach
          'rgb(134, 239, 172)', // light green
          'rgb(74, 222, 128)'   // green
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Task Distribution'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Overall Progress</h3>
        <div className="h-2 bg-peach-light rounded-full overflow-hidden">
          <div 
            className="h-full bg-green transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-text-light mt-2">{completionPercentage}% Complete</p>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ProgressChart; 