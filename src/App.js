import React from 'react';
import logo from './logo.svg';
import './App.css';

import { withAuthenticator } from 'aws-amplify-react'
import { API, graphqlOperation } from 'aws-amplify'
import uuid from 'uuid/v4'
import { listPets as ListPets } from './graphql/queries'
import { createPet as CreatePet } from './graphql/mutations'
import { onCreatePet as OnCreatePet } from './graphql/subscriptions'
const CLIENT_ID = uuid()

class App extends React.Component {
  state = { name: '', description: '', pets: [] }
  subscription = {}
  async componentDidMount() {
    this.subscription = API.graphql(
      graphqlOperation(OnCreatePet)
    ).subscribe({
        next: (eventData) => {
          console.log('eventData', eventData)
          const pet = eventData.value.data.onCreatePet
          if (pet.clientId === CLIENT_ID) return
          
          const pets = [ ...this.state.pets, pet]
          this.setState({ pets })
        }
    })
    try {
      const pets = await API.graphql(graphqlOperation(ListPets))
      console.log('pets:', pets)
      this.setState({
        pets: pets.data.listPets.items
      })
    } catch (err) {
      console.log('error fetching pets...', err)
    }
  }
  createPet = async() => {
    const { name, description } = this.state
    if (name === '' || description === '') return
    const pet = {
      name, description, clientId: CLIENT_ID
    }
    const updatedPetArray = [...this.state.pets, pet]
    this.setState({ pets: updatedPetArray })
    try {
      await API.graphql(graphqlOperation(CreatePet, { input: pet }))
      console.log('item created!')
    } catch (err) {
      console.log('error creating pet...', err)
    }
  }
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  render() {
    return (
      <div className="App">
       <h1>Pet App</h1>
       <input
          name='name'
          onChange={this.onChange}
          value={this.state.name}
        />
        <input
          name='description'
          onChange={this.onChange}
          value={this.state.description}
        />
        <button onClick={this.createPet}>Create Pet</button>
       {
          this.state.pets.map((pet, index) => (
            <div key={index}>
              <h3>{pet.name}</h3>
              <p>{pet.description}</p>
            </div>
          ))
        }
      </div>
    )
  }
}

export default withAuthenticator(App, { includeGreetings: true })
// export default App