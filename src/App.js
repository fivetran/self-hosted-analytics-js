import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

const App = () => (
  <Router>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <nav className="App-nav">
          <Link to="/" className="App-link">Home</Link>
          <Link to="/about" className="App-link">About</Link>
        </nav>
        <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
        </div>
      </header>
    </div>
  </Router>
);

const Home = () => (
  <p>Home page</p>
)

const About = () => (
  <p>About page</p>
)

export default App;
