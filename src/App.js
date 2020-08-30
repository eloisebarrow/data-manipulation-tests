import React, { useState } from 'react';
import './App.css';

// DATA FILES
import personObjects from './components/personObjects.js';
import employees from './components/employees.js';
import fruit from './components/fruits.js';
import transactions from './components/transactions.js';

function App() {
  // Some examples from https://codesquery.com/javascript-array-method-map-filter-and-reduce/
  // MAP
  const updatePersons = personObjects.map(p => p.experienceInYear >= 6 ? {...p,designation: "lead"} : p)
  // FILTER
  const seniorAssociates = employees.filter(emp => emp.group == 'senior associate')
  // REDUCE from https://medium.com/nona-web/understanding-javascript-reduce-and-its-use-cases-49a89d3aaa80
  const fruitTally = fruit.reduce((currentTally, currentFruit) => {
    currentTally[currentFruit] = (currentTally[currentFruit] || 0) + 1
    return currentTally
  }, {})

  transactions.sort((a, b) => b - a) // sort in descending order

  const monthlyTransactions = transactions
  .reduce((transactionGroup, transaction) => {
    const date = new Date(transaction.timestamp)
    const year = date.getFullYear() // e.g '2017'
    const month = `${date.toLocaleString('en-us', { month: 'long' })} ${year}` 
    // e.g. 'January 2018'
    
    transactionGroup[month] = (transactionGroup[month] || []) 
    // initializes array if it doesn't exist
    
    transactionGroup[month].push(transaction.amount) 
    // pushes the transaction amount to the current month
 
    return transactionGroup
  }, {})

  console.log('monthlyTransactions:', monthlyTransactions)

  return (
    <div className="App">
      <h1>Data Manipulation Tests</h1>
      {/* <h4>New Leader:</h4>
      { updatePersons.filter(p => p.designation == 'lead').map(p => p.name) }

      <h4>Senior Associates:</h4>
      { seniorAssociates.map(emp => {
        return (
          <p>{emp.name}</p>
        )
        })} */}
     
      <h4>Transactions:</h4>
      { Object.keys(monthlyTransactions).map((monthYear, i) => {
          return (
            <p>{monthYear}</p>
          )
        }) 
      }
    </div>
  );
}

export default App;
