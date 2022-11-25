import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: '2010',
    iphone: 0,
    ipad: 0,
    itouch: 0
  },
  {
    name: '2011',
    iphone: 50,
    ipad: 15,
    itouch: 5
  },
  {
    name: '2012',
    iphone: 20,
    ipad: 50,
    itouch: 65
  },
  {
    name: '2013',
    iphone: 60,
    ipad: 12,
    itouch: 7
  },
  {
    name: '2014',
    iphone: 30,
    ipad: 20,
    itouch: 120
  },
  {
    name: '2015',
    iphone: 25,
    ipad: 80,
    itouch: 40
  },
  {
    name: '2016',
    iphone: 10,
    ipad: 10,
    itouch: 10
  }
];

const AreaSmoothChart = () => {
  return (
    <React.Fragment>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" />
          <YAxis type="number" domain={[0, 'dataMax + 80']} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area type="monotone" dataKey="iphone" stroke="none" fill="#2ed8b6" />
          <Area type="monotone" dataKey="ipad" stroke="none" fill="#73b4ff" />
          <Area type="monotone" dataKey="itouch" stroke="none" fill="#ff869a" />
        </AreaChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default AreaSmoothChart;
