import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/navbar"
import Login from "./components/login"
import Signup from "./components/signup"
import './App.css';

function App() {
  return (
    <Router>
      <Route exact path='/'  component={Login} />
      <Route path='/signup'  component={Signup} />
    </Router>
  );
}

export default App;
