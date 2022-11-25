import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  {
    name: '2008',
    'Bar 1': 50,
    'Bar 2': 40,
    'Bar 3': 35,
    pv: 80,
    amt: 140
  },
  {
    name: '2009',
    'Bar 1': 75,
    'Bar 2': 65,
    'Bar 3': 60,
    pv: 96,
    amt: 150
  },
  {
    name: '2010',
    'Bar 1': 50,
    'Bar 2': 40,
    'Bar 3': 55,
    pv: 109,
    amt: 98
  },
  {
    name: '2011',
    'Bar 1': 75,
    'Bar 2': 65,
    'Bar 3': 85,
    pv: 120,
    amt: 122
  },
  {
    name: '2012',
    'Bar 1': 100,
    'Bar 2': 90,
    'Bar 3': 40,
    pv: 68,
    amt: 170
  },
  {
    name: '2013',
    'Bar 1': 80,
    'Bar 2': 85,
    'Bar 3': 45,
    pv: 90,
    amt: 85
  }
];

const ComboChart = () => {
  return (
    <React.Fragment>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="amt" fill="#59e0c5" stroke="none" />
          <Bar dataKey="Bar 1" fill="#73b4ff" />
          <Bar dataKey="Bar 2" fill="#ffcb80" />
          <Bar dataKey="Bar 3" fill="#ff869a" />
          <Line dataKey="pv" stroke="#FF5370" strokeWidth={5} />
        </ComposedChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default ComboChart;
