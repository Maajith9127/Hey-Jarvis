import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

import Photo from './Components/ToDos/LivePhoto/LivePhoto.jsx';
import WebBlocking from './Components/ToDos/WebBlocking/WebBlocking.jsx';
import AppBlocking from './Components/ToDos/AppBlocking/AppBlocking.jsx';
import LiveVideo from './Components/ToDos/LiveVideo/LiveVideo.jsx';

import Message from './Components/Accountability/Message/Message.jsx';
import Payment from './Components/Accountability/Payment/Payment.jsx';


import { Provider } from 'react-redux';
import { store } from './ReduxToolkit/store.js';


// Policies
import Terms from './Components/Policies/Terms.jsx';
import Refund from './Components/Policies/Refund.jsx';
import Privacy from './Components/Policies/Privacy.jsx';
import Contact from './Components/Policies/Contact.jsx';
import AboutUs from './Components/Policies/AboutUs.jsx';


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <Router>
      <Routes>
        {/* To Dos */}
        <Route path="/" element={<App />} />
        <Route path="/livephoto" element={<Photo />} />
        <Route path="/randomised" element={<Photo />} />

        <Route path="/webblocking" element={<WebBlocking />} />
        <Route path="/appblocking" element={<AppBlocking />} />
        <Route path="/LiveVideo" element={<LiveVideo />} />
        {/* Accountability   */}
        <Route path='/message' element={<Message />} />
        <Route path='/payment' element={<Payment />} />

        {/* Compliance Pages */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/privacy" element={<Privacy />} /> {/* optional but recommended */}
        <Route path="/about" element={<AboutUs />} />

      </Routes>
    </Router>
  </Provider>
  // </StrictMode>,
)
