const chartData = {
  height: 275,
  type: 'donut',
  options: {
    dataLabels: {
      enabled: false
    },
    colors: ['#1abc9c', '#0e9e4a', '#00acc1', '#f1c40f', '#536dfe', '#e74c3c'],
    labels: ['New', 'Contacted', 'Working', 'Qualified', 'Proposal Sent', 'Customer'],
    legend: {
      show: true,
      position: 'bottom'
    }
  },
  series: [85.7, 77.56, 20.9, 10.9, 15.8, 86.7]
};

export default chartData;
