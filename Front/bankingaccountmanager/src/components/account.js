import React,{useEffect, useState} from 'react';
// eslint-disable-next-line react-hooks/exhaustive-deps
import axios from 'axios';
import { toast } from 'react-toastify';
import {Link} from 'react-router-dom';


function Account() {
    const [users, setUsers] = useState([]);
    const [orgs, setOrgs] = useState([]);
    const [text, setText] = useState("");
    const [Money, setMoney] = useState(0);
    const [charity, setCharity] = useState(0);
    const [code, setCode] = useState('');
    const [show, setShow] = useState(false);
    const [showsub, setShowsub] = useState(false);
    const [showrech, setShowrech] = useState(false);
    const [charity_id, setCharityID] = useState(0);
    const [sold, setSold] = useState(0);
    const [recharge, setRecharge] = useState(0);

    //Block style on click
    const sendblock = {
        "display": "flex",
        "flexDirection": "column",
        "justifyContent": "center",
        "margin": "10px 40px",
        "border":"solid rgb(40, 250, 92) 1px",
        "padding":"10px"
        }
    //None style on click
    const sendnone = {
        "display": "none",
    }
    //geeting the token from local storage
    const jwt = localStorage.getItem("jwt");
    // console.log({'jwt':jwt})

    //Selecting the user and the organisations data
    useEffect(()=>{
        axios.post('http://localhost:8000/user', {'jwt':jwt})
        .then(res => {
            // console.log(res.data);
            updateMoney(res.data.amount)
            setUsers(res.data);
        })
        .catch(error => {
            console.log(error)
        })
        axios.post('http://localhost:8000/GetOrganisations', {'jwt':jwt})
        .then(res => {
            // console.log(res.data);
            setOrgs(res.data)
        })
        .catch(error => {
            console.log(error)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    //Displaying div onclick 
    const displaydiv = () =>{
        setShow(!show)
    }
    const displaysub = () =>{
        setShowsub(!showsub)
    }
    //Loging out and deleting the token
    const logout = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/logout');
            // console.log(resp.data.jwt);
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
    //On "name" select get informations about that organisation
    const infofinder = (e) =>{
        const title = e.target.value; 
            orgs.forEach(el =>{
                if(el.organization === title){
                    setText(el.info)
                    setCharityID(el.id)
                }
            })
        
    }
    //Send Money from user to another user
    const Send = (e) =>{
        e.preventDefault()
        const Sendeddata = {'code':code, 'Money':parseFloat(Money),'jwt':jwt}
        // console.log(typeof(Sendeddata.Money))
        axios.post('http://localhost:8000/SendMoney', Sendeddata)
        .then(res => {
            // console.log(res.data);
            updateMoney(res.data.Rest)
        })
        .catch(error => {
            console.log(error)
        })
    }
    //Send charity 
    const Subscribe = (e) =>{
        const data = {"charity":parseInt(charity),charity_id,jwt}
        // console.log(data)
        axios.post('http://localhost:8000/Sendcharity', data)
        .then(res => {
            // console.log(res.data);
            updateMoney(res.data.Rest)
        })
        .catch(error => {
            console.log(error)
        })
    }
    //Recharge account
    const Recharge = (e) =>{
        const data = {"Money":parseInt(recharge),jwt}
        // console.log(data)
        axios.post('http://localhost:8000/recharge', data)
        .then(res => {
            // console.log(res.data);
            updateMoney(res.data.Amount)
        })
        .catch(error => {
            console.log(error)
        })
    }
    //Update the amount of money you have after each opération
    const updateMoney = (rest) =>{
        setSold(rest)
    }
    return (
        <div className="account">
            <h2 className='title'>Welcome {users.username} </h2>
            <div className='amount'> {sold} DT</div>
            <button className='logout' onClick={logout}>Log out</button>

            {/* Send Money container */}
            <button className='send' onClick={displaydiv}>Send Money</button>
            <div style={show ? sendblock : sendnone}>
                <input className='sender' type='number' value= {Money} onChange={(e)=>{setMoney(e.target.value)}} placeholder='How much to send ...'/>
                <input className='benif' type='text' value= {code} onChange={(e)=>{setCode(e.target.value)}} placeholder='to who ...'/>
                <button className='send' onClick={Send}>Send</button>
            </div>

            {/* Subscription container */}
            <button className='subscribe' onClick={displaysub}>Subscribe</button>
            <div style={showsub ? sendblock : sendnone}>
                {/* Getting all the organisations inside the select box*/}
                <select className='sender' onChange={infofinder}>
                    <option>Choose the organisation ...</option>
                {orgs.map(org=> {
                    return <option id={org.id} key={org.id}>{org.organization}</option>
                })}
                </select>
                {/* The text is updated based on the selected organisation */}
                <p>{text}</p>
                <input className='sender' type='number' value= {charity} onChange={(e)=>{setCharity(e.target.value)}} placeholder='How much to send ...'/>
                <button className='send' onClick={Subscribe}>Donate</button>
            </div>
        
            <button className='Recharge' onClick={() => setShowrech(!showrech)}>Recharge</button>
            <div style={showrech ? sendblock : sendnone}>
                <p>{text}</p>
                <input className='sender' type='number' value= {recharge} onChange={(e)=>{setRecharge(e.target.value)}} placeholder='How much to send ...'/>
                <button className='send' onClick={Recharge}>Recharge</button>
            </div>
            
            {/* Link to transations history */}
            <Link to="/transactions" className='transaction'>
            <button>My transactions</button>
            </Link>
        </div>
    )
}

export default Account
