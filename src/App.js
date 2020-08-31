import React, { useState, useEffect } from 'react';
import './App.css';

// DATA FILES
import personObjects from './components/personObjects.js'; // MAP EXAMPLE
import employees from './components/employees.js'; // FILTER EXAMPLE
import fruit from './components/fruit.js'; // REDUCE EXAMPLE
import blogs from './components/blogs.js'; // REDUCE EXAMPLE
import transactions from './components/transactions.js'; // REDUCE EXAMPLE

function App() {
  // HOOKS
  const [reps, setReps] = useState([])
  const [loading, setLoading] = useState(false)
  const [breakdownParties, setBreakdownParties] = useState({})

  // Some examples from https://codesquery.com/javascript-array-method-map-filter-and-reduce/
  // MAP
  const updatePersons = personObjects.map(p => p.experienceInYear >= 6 ? {...p,designation: "lead"} : p)
  // FILTER
  const seniorAssociates = employees.filter(emp => emp.group == 'senior associate')
  // REDUCE from https://medium.com/nona-web/understanding-javascript-reduce-and-its-use-cases-49a89d3aaa80
  const fruitCount = fruit.reduce((accumulator, fruit) => {
    accumulator[fruit] = (accumulator[fruit] || 0) + 1
    return accumulator
  }, {})

  const comments = blogs.reduce((accumulator, blog) => {
    return accumulator.concat(blog.comments) // merge each comments array into the accumulator
  }, [])

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

  // FETCH
  const fetchGovData = async () => {
    let data = await fetch('https://www.govtrack.us/api/v2/role?current=true&role_type=representative&limit=439')
    .then(resp => resp.json())
    .then(data => { return data.objects })
    setReps(data)
    return data;
  }

  const showRepublicans = async () => {
    let data = await fetchGovData()
    setLoading(false)
    let repubs = data.filter(member => member.party.toLowerCase() === 'republican')
    setReps(repubs)
  }

  const showDemocrats = async () => {
    let data = await fetchGovData()
    setLoading(false)
    let dems = data.filter(member => member.party.toLowerCase() === 'democrat')
    setReps(dems)
  }

  const handleShowRepublicans = async () => {
    setReps([])
    setLoading(true)
    await showRepublicans()
    getPartyNumbers()
    console.log(reps)
  }

  const handleShowDemocrats = async () => {
    setReps([])
    setLoading(true)
    await showDemocrats()
    getPartyNumbers()
    console.log(reps)
  }

  const handleNumRepublicans = async () => {
    // setReps([])
    // setLoading(true)
    // let allReps = await fetchGovData()
    // setLoading(false)
    // setReps(allReps)
    getPartyNumbers()
  }

  const getPartyNumbers = () => {
    let breakdown = reps.reduce((accum, member) => {
      accum[member.party] = (accum[member.party] || 0) + 1
      return accum
    }, {})
    setBreakdownParties(breakdown)
    console.log(breakdownParties)
  }

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
        })}
     
      <h4>Transactions:</h4>
      { Object.keys(monthlyTransactions).map((monthYear, i) => {
          return (
            <p>{monthYear}</p>
          )
        }) 
      }
      
      <h4>Blog comments:</h4>
      { comments.map((comm, i) => {
        return (
          <p key={i}>{comm}</p>
        )
      })} */}
      <h2>House Representatives</h2>
      <button onClick={() => handleShowRepublicans()}>Republicans</button>
      <button onClick={() => handleShowDemocrats()}>Democrats</button>
      <button onClick={() => handleNumRepublicans()}>Party Breakdown</button>
      {/* <button onClick={() => handleNumRepublicans()}># of Democrats</button> */}
      
      { loading ? <h3 className="loading">Loading...</h3> : null }

      <h3>Parties</h3>

      { Object.keys(breakdownParties).map((party, i) => {
        return (
          <h4>{party}</h4>
        )
      })}

      <ul>
        { reps.map((member, i) => {
            return (
              <>
              <h4>{member.person.firstname} {member.person.lastname}</h4>
              <li>Party: {member.party}</li>
              <li>Term ends: {member.enddate}</li>
              <li>Title: {member.title_long}</li>
              <li>State: {member.state}</li>
              <li>District: {member.district}</li>
              <a href={`${member.website}`} target="_blank" rel="noopener noreferrer">Website</a>
              <br></br>
              </>
            )
        }) }
      </ul>

    </div>
  );
}

export default App;
