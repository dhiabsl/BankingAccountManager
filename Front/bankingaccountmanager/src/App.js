//CSS file for all the project
import './App.css';
//Components
import Register from './components/register';
import Login from './components/login';
import Account from './components/account';
import charityorganisations from './components/charityorganisations';
import Transactions from './components/transactions';
//The protected route is for the access controle (no log-in no access) 
import ProtectedRoute from './components/ProtectedRoute';
//Using the toast notification library
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//Using the React router dom library
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

//The app as a functional component
function App() {
  return (
    <Router>
      {/* Notifications are displayed here */}
    <ToastContainer></ToastContainer>
    {/* Routing for all components */}
    <Switch>
        {/* Routes that do not re'quire to log in */}
        <Route exact path="/" component={Login}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        {/* Routes that you need to log in to access */}
        <ProtectedRoute exact path="/account" component={Account}/>
        <ProtectedRoute exact path="/organisations" component={charityorganisations}/>
        <ProtectedRoute exact path="/transactions" component={Transactions}/>
        {/* In case if the route not found display 404 error */}
        <Route path="*" component={() => "404 NOT FOUND"} />
    </Switch>
    </Router>
  );
}

export default App;
