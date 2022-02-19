import React from 'react'
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [username, setUsername] = React.useState('');

    const log = () => {
        Axios.post('http://localhost:5000/user/register', {username:username,email:email,password:password})
            .then(res => {
                console.log(res.data);
                if(res.data.status===404||res.data.status===400)
                {
                    alert(res.data.message);
                }
                else
                {
                    // console.log(res.data.token);
                    navigate('/');
                }
            });
    }
    return (
        <div>
            <input type="text" placeholder="Username" onChange={(e)=>{setUsername(e.target.value)}} required/>
            <input type="text" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}} required/>
            <input type="password" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}} required/>
            <button onClick={log}>Register</button>
        </div>
    );
}

export default Register
