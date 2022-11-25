const chartData = {
  height: 275,
  type: 'donut',
  options: {
    dataLabels: {
      enabled: false
    },
    colors: ['#1abc9c', '#00acc1', '#f1c40f', '#536dfe', '#0e9e4a'],
    labels: ['Not started', 'In progress', 'On hold', 'Cancelled', 'Finished'],
    legend: {
      show: true,
      position: 'bottom'
    }
  },
  series: [85.7, 77.56, 20.9, 10.9, 15.8]
};

export default chartData;
