import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'; // Correct import
import store from './store';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <Provider store={store}> 
      <App />
    </Provider>
  //</React.StrictMode>
);
