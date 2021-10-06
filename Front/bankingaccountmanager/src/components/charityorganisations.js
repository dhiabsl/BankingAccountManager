import React,{useState,useEffect} from 'react';
// eslint-disable-next-line react-hooks/exhaustive-deps
import axios from 'axios'

function Charityorganisations() {
    const [Orgs, setOrgs] = useState([]);
    const jwt = localStorage.getItem("jwt");
    // console.log({'jwt':jwt})
    useEffect(()=>{
        axios.post('http://localhost:8000/GetOrganisations', {'jwt':jwt})
        .then(res => {
            console.log(res.data);
            setOrgs(res.data)
        })
        .catch(error => {
            console.log(error)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <div>
            {Orgs.map(Org => {
                return <div  key={Org.id}><h3>{Org.organization}</h3><span>{Org.info}</span></div>

            })}
        </div>
    )
}

export default Charityorganisations
