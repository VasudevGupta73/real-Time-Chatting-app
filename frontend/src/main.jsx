import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from '../redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

export const serverUrl = 'http://localhost:4000/api';

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

const container = document.getElementById('root');
const root = window.__react_root__ || createRoot(container);
window.__react_root__ = root;

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
