import './App.css';
import Register from './components/register';
import Login from './components/login';
import Account from './components/account';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
    <ToastContainer></ToastContainer>
    <Switch>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <ProtectedRoute exact path="/account" component={Account}/>
        <Route path="*" component={() => "404 NOT FOUND"} />
    </Switch>
    </Router>
  );
}

export default App;
