import React from 'react';
import { Router, Route, Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import './App.css';

const history = createBrowserHistory();

// Track client routing
history.listen(location => window['analytics'].page());

const App = () => (
  <Router history={history}>
    <div className="App">
      <p className="App-info">
          View events at <a href="https://pipedream.com/r/enxqu2io6sdml" target="_blank" rel="noopener noreferrer">https://pipedream.com/r/enxqu2io6sdml</a>
      </p>
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
  <>
    <p>About page</p>
    <button
      onClick={() => {
        window['analytics'].track('React Demo Button Clicked');
        alert('`React Demo Button Clicked` event tracked! Thank you!');
      }}
    >
      Click Me
    </button>
    <div className="button-description">To track `React Demo Button Clicked` event.</div>
  </>
)

export default App;
