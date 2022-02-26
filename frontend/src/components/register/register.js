import React from 'react'
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

import styles from './register.module.css';

// import TextField from '@material-ui/core/TextField';
import { makeStyles,TextField,Button } from '@material-ui/core';
// import classes from '../styles.js';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [username, setUsername] = React.useState('');

    const useStyles = makeStyles(() => ({
        textField: {
          paddingBottom: 20,
        },
        input: {
          color: "white"
        },
        regButton: {
            backgroundColor: "#00a896",
            cursor: "pointer",
        }
    }));
    
    const classes = useStyles();
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
        <div className={styles.wrapper}>
            <div className={styles.loginContainer}>
            <TextField id="outlined-basic" className={classes.textField} label="Username" onChange={(e)=>{setUsername(e.target.value)}} variant="outlined" required/>
                <TextField id="outlined-basic" className={classes.textField} label="Email" onChange={(e)=>{setEmail(e.target.value)}} variant="outlined" required/>
                <TextField id="outlined-basic" className={classes.textField} label="Password" onChange={(e)=>{setPassword(e.target.value)}} variant="outlined" />
                <Button onClick={log} variant="contained" color="secondary" className={classes.regButton}>Register</Button>
            </div>  
        </div>
    );
}

export default Register
