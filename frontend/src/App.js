import React from 'react';
import FinancialDataTable from './Components/FinancialDataTable';

const App = () => {
  return (
    <div className="App">
      <h1 className="text-center text-2xl font-bold p-4">Financial Data</h1>
      <FinancialDataTable />
    </div>
  );
}

export default App;