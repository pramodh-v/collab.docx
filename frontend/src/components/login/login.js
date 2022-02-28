import React from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import Axios from 'axios';

import styles from './login.module.css';

import { makeStyles,TextField,Button,Typography } from '@material-ui/core';

const Login = () => {
    // const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const useStyles = makeStyles(() => ({
        textField: {
          paddingBottom: 20,
        },
        input: {
          color: "white"
        },
        loginButton: {
            backgroundColor: "#00a896",
            cursor: "pointer",
        }
    }));

    const classes = useStyles();

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
                    console.log(res.data.user);
                    let userDetails = {
                        _id: res.data.user._id,
                        username: res.data.user.username,
                        email: res.data.user.email,
                        token: res.data.token
                    }
                    Cookies.set('userDetails', JSON.stringify(userDetails));
                    localStorage.setItem('isAuthenticated',"true");
                    localStorage.setItem('userToken',res.data.token);
                    navigate('/home');
                    // setAuth({ token: res.data.token, user: res.data.user });
                }
            });
    }
    return (
        <div className={styles.wrapper}>
            {/* <h1>Collab.docx</h1> */}
            <div className={styles.loginContainer}>
                <TextField id="outlined-basic" className={classes.textField} label="Email" onChange={(e)=>{setEmail(e.target.value)}} variant="outlined" required/>
                <TextField id="outlined-basic" className={classes.textField} type="password" label="Password" onChange={(e)=>{setPassword(e.target.value)}} variant="outlined" />
                <Button onClick={log} variant="contained" color="secondary" className={classes.loginButton}>Login</Button>
            </div>  
        </div>
    );
}

export default Login
