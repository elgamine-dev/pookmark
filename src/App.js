import React, { Component } from 'react';
import './App.css';
import Marks from "./Marks";
import Share from './Share'
import firebase from 'firebase/app'
import 'firebase/firestore'

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    databaseURL: process.env.REACT_APP_DB_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
}

firebase.initializeApp(config)
const db = firebase.firestore()

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Pookmark
          <button>+</button>
        </header>
        <main>
          <Share db={db} />
          <Marks db={db} />
        </main>
      </div>
    );
  }
}

export default App;
