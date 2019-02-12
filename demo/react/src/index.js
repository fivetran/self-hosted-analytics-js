import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {initAnalytics} from './initAnalytics';
import * as serviceWorker from './serviceWorker';

// View this endpoint at https://pipedream.com/r/enxqu2io6sdml
initAnalytics('https://enxqu2io6sdml.x.pipedream.net');

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
