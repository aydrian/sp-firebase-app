import React, { Component } from 'react';
import logo from './logo.png';
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
          <h2>SparkPost Zoo</h2>
        </div>
        <p>Send an email to <a href="mailto:zoo@hey.aydrian.me">zoo@hey.aydrian.me</a> with your name in the subject.</p>
        <h3>Animals: {this.state.players.length}</h3>
        <Animals players={this.state.players} />
        <div className="footer">Code available on Github: <a href="https://github.com/aydrian/sp-firebase-app">sp-firebase-app</a></div>
      </div>
    );
  }
}

export default App;
