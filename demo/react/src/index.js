import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {initAnalytics} from './initAnalytics';
import * as serviceWorker from './serviceWorker';

initAnalytics('events.fivetran.com/webhooks/1k56c2c4xlti6/segment');

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
