import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/login"
import Signup from "./components/signup"
import Search from "./components/search"
import Home from "./components/home"
import Requests from "./components/requests"
import './App.css';

function App() {
  return (
    <Router>
      <Route exact path='/'  component={Login} />
      <Route path='/signup'  component={Signup} />
      <Route path='/home'  component={Home} />
      <Route path='/search'  component={Search} />
      <Route path='/requests'  component={Requests} />
    </Router>
  );
}

export default App;
