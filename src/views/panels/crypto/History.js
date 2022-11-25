import React from 'react';

import Deposit from './history-trading/Deposit';
import Withdraw from './history-trading/Withdraw';
import Transaction from './history-trading/Transaction';

const History = () => {
  return (
    <React.Fragment>
      <Deposit />
      <Withdraw />
      <Transaction />
    </React.Fragment>
  );
};

export default History;
