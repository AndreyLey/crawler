import React from 'react';
import './App.css';
import CrawlerJobs from './components/CrawlerJobs/CrawlerJobs';
import Search from './components/Search/Search'
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://localhost:5050/ws');

function App() {
  return (
    <div className="App">
      <Search socket={client}/>
    </div>
  );
}

export default App;
