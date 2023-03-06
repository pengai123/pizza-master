import React, { useState, useEffect } from 'react'
import OwnerView from './components/OwnerView'
import ChefView from './components/ChefView'
import NavBar from './components/NavBar'

export const Context = React.createContext()

function App() {

  const [role, setRole] = useState('owner')
  const [toppings, setToppings] = useState([])
  const [categories, setCategories] = useState(['Vegetable', 'Meat', 'Other'])
  const [pizzas, setPizzas] = useState([])

  const fetchToppings = async () => {
    const response = await fetch('/api/toppings')
    const data = await response.json()
    console.log('data:', data)
    setToppings(data)
  }

  useEffect(() => {
    fetchToppings()
  }, [])

  return (
    <div className="App">
      <Context.Provider value={{ toppings, setToppings, categories }}>
        <NavBar />
        <div className='container'>
          <div className='view-select'>
            <span>View:</span>
            <button className='btn-owner' onClick={() => setRole('owner')} style={{backgroundColor: role === 'owner' ? 'aqua' : 'lightgray'}}>Owner</button>
            <button className='btn-chef' onClick={() => setRole('chef')} style={{backgroundColor: role === 'chef' ? 'aqua' : 'lightgray'}}>Chef</button>
          </div>
          {role === 'owner' && <OwnerView />}
          {role === 'chef' && <ChefView />}
        </div>
      </Context.Provider>
    </div>
  );
}

export default App;
