import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import AddOrderForm from './components/AddOrderForm';
import OrderDetails from './components/OrderDetails';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LoginForm} />
        <Route path="/signup" component={SignupForm} />
        <Route path="/add-user" component={UserForm} />
        <Route path="/add-order" component={AddOrderForm} />
        <Route path="/order-details" component={OrderDetails} />
      </Switch>
    </Router>
  );
}

export default App;
