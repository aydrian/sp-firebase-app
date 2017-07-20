import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import Animals from './components/Animals/Animals';

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

    playersRef.on('value', (snap) => {
      let newPlayers = [];
      snap.forEach(childSnapshot => {
        newPlayers.push(childSnapshot.val());
      })
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
        <p>Send an email to zoo@hey.aydrian.me with your name in the subject.</p>
        <Animals players={this.state.players} />
      </div>
    );
  }
}

export default App;
