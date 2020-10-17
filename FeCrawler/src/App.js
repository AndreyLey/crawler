import React from 'react';
import './App.css';
import CrawlerJobs from './components/CrawlerJobs/CrawlerJobs';
import Search from './components/Search/Search'
import { w3cwebsocket as W3CWebSocket } from "websocket";

// const io = require('socket.io-client');
// const socket = io('http://localhost:5050/ws');
// const WebSocketClient = require('websocket').client;
const client = new W3CWebSocket('ws://127.0.0.1:5050/ws');
const url="http://localhost:5050"

function App() {
  return (
    <div className="App">
      <Search url={url} socket={client}/>
      {/* <CrawlerJobs/> */}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
