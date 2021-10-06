import React, { useState} from 'react';
// eslint-disable-next-line react-hooks/exhaustive-deps
import axios from 'axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom'

function Login() {
    let history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Sending login data to server
    // The server will create a token and send it back if the user is registered
    //we store the token in local storage and isAuthenticated to true
    //And we send a notification
    //then we push the user to the account page
    async function sendreq(e) {
        try {
            e.preventDefault();
            const quest = {"email" : email,"password" : password}
            // console.log(quest)
            const resp = await axios.post('http://127.0.0.1:8000/login', quest);
            console.log(resp.data.jwt);
            localStorage.setItem('isAuthenticated', true)
            localStorage.setItem('jwt',resp.data.jwt)
            toast.success("Your logged in")
            history.push('/account')
        } catch (err) {
            // Handle Error Here
                // 404 will be loged below
            //    console.log(err.response.status)
            //    console.log(err.response.data.detail)
               toast.error(err.response.data.detail)
        }
    };

    return (
        <div className='logincontainer'>
            <form className='login'>
                <h1>LOG IN</h1>
                <label>Username :</label>
                <input type='email' placeholder='Email' name='email' autoComplete="off" value={email} onChange={e => setEmail(e.target.value)}/>
                <label>Password :</label>
                <input type='password' placeholder='Password' name='password' value={password} onChange={e => setPassword(e.target.value)}/>
                <div className='buttons'>
                    <button onClick={sendreq}> Log in </button>
                    <button onClick={() => history.push('/register')}> Sign in </button>
                    
                </div>
            </form>
        </div>
    )
}

export default Login
