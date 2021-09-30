import React,{useState} from 'react'
import axios from 'axios'

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cin, setCin] = useState(0);
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState(0);
    const [amount, setAmount] = useState(0);
    const [code, setCode] = useState('');

    async function sendreq(e){
        try {
            e.preventDefault();
            const quest = {email,password,cin,username,phone,amount,code}
            console.log(quest)
            const resp = await axios.post('http://127.0.0.1:8000/register', quest);
            console.log(resp.data);
        } catch (err) {
            // Handle Error Here
                // 404 will be loged below
               console.log(err.response.status)
               console.log(err.response)
        }
    }
    return (
        <div className='logincontainer'>
            <form className='login'>
                <h1>SIGN IN</h1>
                <label>Code :</label>
                <input type='text' placeholder='Code' name='code' value={code} onChange={e => setCode(e.target.value)}/>
                <label>Email :</label>
                <input type='email' placeholder='Email' name='email' value={email} autoComplete="off" onChange={e => setEmail(e.target.value)}/>
                <label>Password :</label>
                <input type='password' placeholder='Password' name='password' value={password} onChange={e => setPassword(e.target.value)}/>
                <label>Cin :</label>
                <input type='number' placeholder='CIN number' name='cin' value={cin} onChange={e => setCin(e.target.value)}/>
                <label>Username :</label>
                <input type='text' placeholder='Username' name='username' value={username} onChange={e => setUsername(e.target.value)}/>
                <label>Phone :</label>
                <input type='number' placeholder='Your phone number' value={phone} name='phone' onChange={e => setPhone(e.target.value)}/>
                <label>Amount :</label>
                <input type='number' placeholder='Your money' name='amount' value={amount} onChange={e => setAmount(e.target.value)}/>
                <div className='buttons'>
                    <button onClick={sendreq}> Log in </button>
                </div>
            </form>
        </div>
    )
}
export default Register
