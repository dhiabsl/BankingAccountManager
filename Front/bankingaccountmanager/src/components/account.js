import React,{useEffect, useState} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


function Account() {
    const [users, setUsers] = useState([]);
    useEffect(()=>{
        axios.get('https://jsonplaceholder.typicode.com/posts')
        .then(res => {
            console.log(res.data);
            setUsers(res.data)
        })
        .catch(error => {
            console.log(error)
        })
    },[])
    const logout = async () => {
        try {
            const resp = await axios.post('http://127.0.0.1:8000/logout');
            console.log(resp.data.jwt);
            toast.success("Your logged out")
            localStorage.clear()
            window.location.pathname = '/login'
        } catch (err) {
            // Handle Error Here
                // 404 will be loged below
            //    console.log(err.response.status)
            //    console.log(err.response.data.detail)
               toast.error(err.response.data.detail)
        }
    }


    return (
        <div>
            <p>Welcome to your account</p>
            <button onClick={logout}>Log out</button>
        </div>
    )
}

export default Account
