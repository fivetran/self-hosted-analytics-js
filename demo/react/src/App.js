import React from 'react';
import { Router, Route, Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import logo from './logo.svg';
import './App.css';

const history = createBrowserHistory();

// Track client routing
history.listen(location => window['analytics'].page());

const App = () => (
  <Router history={history}>
    <div className="App">
      <header className="App-header">
        <div className="loading">
          <div className='loading-wrapper'>
              <div className='rect1'></div>
              <div className='rect2'></div>
              <div className='rect3'></div>
              <div className='rect4'></div>
              <div className='rect5'></div>
          </div>
        </div>
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
