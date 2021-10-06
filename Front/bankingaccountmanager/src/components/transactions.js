//Importing Hooks to use
//Useeffect instead of component did mount | Usestate instead of setState to update the state
import React,{useEffect, useState} from 'react';
//Use this to prevent axios from throwing warning error
// eslint-disable-next-line react-hooks/exhaustive-deps
import axios from 'axios';
//Use link instead of a href to not reload the page
import {Link} from 'react-router-dom';



function Transactions() {
    //In functional components we can't use "setState" so "useState" is the one
    const [Trans, setTrans] = useState([]);
    //Getting the token to send it to the server
    const jwt = localStorage.getItem("jwt");
    // console.log({'jwt':jwt})
    useEffect(()=>{
        //Sending a post req with the token to verify account
        axios.post('http://127.0.0.1:8000/GetTransactions', {'jwt':jwt})
        .then(res => {
            // console.log(res.data);
            //Getting the data and assigning it
            setTrans(res.data)
        })
        .catch(error => {
            console.log(error)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <div className='transaction'>
            <h1 className='amount'>Transactions</h1>
            {/* Link back to account */}
            <Link to="/account" className='link'>
            <button className='send'>My Account</button>
            </Link>
            {/* Mapping all the data coming from the server */}
            {Trans.map(trans=> {
                // We need to return the " single container" and each element with a primary "key"
                return <div  key={trans.id} className="history">
                <h1>{trans.type}</h1> <span>{trans.date}</span><br/><span>Amount : {trans.amount} DT</span>
            </div>

            })}
        </div>
    )
}

export default Transactions
