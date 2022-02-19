import React from 'react'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const Login = () => {
    // const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginStatus, setLoginStatus] = React.useState(false);

    const log = () => {
        Axios.post('http://localhost:5000/user/login', {email:email,password:password})
            .then(res => {
                console.log(res.data);
                if(res.data.status===404||res.data.status===400)
                {
                    alert(res.data.message);
                }
                else
                {
                    console.log(res.data.token);
                    localStorage.setItem('isAuthenticated',"true");
                    localStorage.setItem('userToken',res.data.token);
                    navigate('/home');
                    setLoginStatus(true);
                    // setAuth({ token: res.data.token, user: res.data.user });
                }
            });
    }
    return (
        <div>
            <input type="text" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}} required/>
            <input type="password" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}} required/>
            <button onClick={log}>Login</button>
        </div>
    );
}

export default Login
