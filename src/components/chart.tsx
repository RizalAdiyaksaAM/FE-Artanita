import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, type ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useChartData } from '@/hooks/donation/use-chart';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartDataPoint {
  x: string;
  y: number;
}

interface ProcessedData {
  [program: string]: ChartDataPoint[];
}

const DonationLineChart: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'daily' | 'monthly'>('daily');

  // Fetch data from API
  const { data: chartResponse, isLoading, error } = useChartData();

  // Color mapping for different programs
  const programColors: { [key: string]: string } = {
    'Zakat': '#10B981',
    'Infaq': '#3B82F6',
    'Wakaf': '#8B5CF6',
    'Total': '#EF4444'
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-[70%] mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data chart...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-[70%] mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="text-red-600">Gagal memuat data chart</p>
            <p className="text-gray-500 text-sm mt-2">Silakan coba lagi nanti</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if data exists
  const rawData = chartResponse?.data || [];
  
  if (rawData.length === 0) {
    return (
      <div className="w-[70%] mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-400 text-xl mb-2">📊</div>
            <p className="text-gray-600">Tidak ada data untuk ditampilkan</p>
          </div>
        </div>
      </div>
    );
  }

  // Get unique programs from API data
  const programs = Array.from(new Set(rawData.map(item => item.program_donation)));

  // Process data based on filters
  const processData = (): ProcessedData => {
    // Group data by time period
    const groupedData: { [key: string]: { [program: string]: number } } = {};

    rawData.forEach(item => {
      let timeKey = item.date;
      
      if (timeFilter === 'monthly') {
        timeKey = item.date.substring(0, 7); // YYYY-MM format
      }

      if (!groupedData[timeKey]) {
        groupedData[timeKey] = {};
      }

      if (!groupedData[timeKey][item.program_donation]) {
        groupedData[timeKey][item.program_donation] = 0;
      }

      groupedData[timeKey][item.program_donation] += item.amount;
    });

    // Convert to chart data format
    const processedData: ProcessedData = {};

    // Initialize program arrays
    programs.forEach(program => {
      processedData[program] = [];
    });
    processedData['Total'] = [];

    // Sort time keys
    const sortedTimeKeys = Object.keys(groupedData).sort();

    sortedTimeKeys.forEach(timeKey => {
      let totalAmount = 0;

      programs.forEach(program => {
        const amount = groupedData[timeKey][program] || 0;
        processedData[program].push({
          x: timeKey,
          y: amount
        });
        totalAmount += amount;
      });

      // Add total aggregate
      processedData['Total'].push({
        x: timeKey,
        y: totalAmount
      });
    });

    return processedData;
  };

  // Prepare chart data
  const prepareChartData = () => {
    const processedData = processData();
    const datasets: any[] = [];

    if (selectedProgram === 'all') {
      // Show all programs + total
      programs.forEach(program => {
        datasets.push({
          label: program,
          data: processedData[program],
          borderColor: programColors[program] || '#6B7280',
          backgroundColor: (programColors[program] || '#6B7280') + '20',
          tension: 0.4,
          fill: false,
        });
      });

      // Add total line
      datasets.push({
        label: 'Total (Agregat)',
        data: processedData['Total'],
        borderColor: programColors['Total'],
        backgroundColor: programColors['Total'] + '20',
        tension: 0.4,
        fill: false,
        borderWidth: 3,
        borderDash: [5, 5],
      });
    } else {
      // Show only selected program
      datasets.push({
        label: selectedProgram,
        data: processedData[selectedProgram],
        borderColor: programColors[selectedProgram] || '#6B7280',
        backgroundColor: (programColors[selectedProgram] || '#6B7280') + '20',
        tension: 0.4,
        fill: false,
      });
    }

    return {
      datasets
    };
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Data Donasi ${timeFilter === 'daily' ? 'Harian' : 'Bulanan'}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return `${context.dataset.label}: Rp ${value.toLocaleString('id-ID')}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: timeFilter === 'daily' ? 'Tanggal' : 'Bulan'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Amount (Rupiah)'
        },
        ticks: {
          callback: function(value) {
            return 'Rp ' + Number(value).toLocaleString('id-ID');
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="w-[70%] mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="!text-2xl font-bold text-gray-800 mb-4">Dashboard Donasi</h2>
        
        {/* Data Info */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            Total data: {rawData.length} record | Program tersedia: {programs.join(', ')}
          </p>
        </div>
        
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Program Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Filter Program:
            </label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Program</option>
              {programs.map(program => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </div>

          {/* Time Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Filter Waktu:
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as 'daily' | 'monthly')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Per Hari</option>
              <option value="monthly">Per Bulan</option>
            </select>
          </div>
        </div>

        {/* Filter Status */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Program: {selectedProgram === 'all' ? 'Semua Program' : selectedProgram}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Periode: {timeFilter === 'daily' ? 'Harian' : 'Bulanan'}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96">
        <Line data={prepareChartData()} options={chartOptions} />
      </div>
    </div>
  );
};

export default DonationLineChart;