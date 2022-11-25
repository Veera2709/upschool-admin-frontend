import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: '2008',
    'Bar 1': 50,
    'Bar 2': 40,
    'Bar 3': 35
  },
  {
    name: '2009',
    'Bar 1': 75,
    'Bar 2': 65,
    'Bar 3': 60
  },
  {
    name: '2010',
    'Bar 1': 50,
    'Bar 2': 40,
    'Bar 3': 55
  },
  {
    name: '2011',
    'Bar 1': 75,
    'Bar 2': 65,
    'Bar 3': 85
  },
  {
    name: '2012',
    'Bar 1': 100,
    'Bar 2': 90,
    'Bar 3': 40
  }
];

const BarSimpleChart = () => {
  return (
    <React.Fragment>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Bar 1" fill="#73b4ff" />
          <Bar dataKey="Bar 2" fill="#2ed8b6" />
          <Bar dataKey="Bar 3" fill="#ff869a" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default BarSimpleChart;
