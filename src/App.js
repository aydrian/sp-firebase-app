import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';

class App extends Component {

  constructor() {
    super();
    this.state = {
      players: []
    };
  }

  componentDidMount() {
    const ref = firebase.database().ref();
    const playersRef = ref.child('players');

    console.log(playersRef.key);
    playersRef.on('value', (snap) => {
      let newPlayers = [];
      snap.forEach(childSnapshot => {
        newPlayers.push(childSnapshot.val());
      })
      console.log(newPlayers);
      this.setState({
        players: newPlayers
      });
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <h1>Players: {this.state.players.length}</h1>
        <ul className="list-group">
          {this.state.players.map((player, index) => (
            <li className="list-group-item" key={index}>
              A {player.animal.name} named {player.subject}. {player.animal.emoji}
            </li>
          ))}
        </ul>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
