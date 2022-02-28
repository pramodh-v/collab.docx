import React,{ useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./home.module.css";
import { makeStyles,TextField,Button,Typography } from "@material-ui/core";

export default function Home() {

    const useStyles = makeStyles(() => ({
        textField: {
          paddingBottom: 20,
        },
        input: {
          color: "white"
        },
        button: {
            backgroundColor: "#00a896",
            cursor: "pointer",
        }
    }));
    const classes = useStyles();

    const navigate = useNavigate();

    const [docName,setDocname] = useState("");
    const [link, setLink] = useState("");

    const userDetails = JSON.parse(Cookies.get("userDetails"));
    const userToken = userDetails.token;
    const userId = userDetails._id;

    if(!userDetails)
    {
        navigate("/");
    }

    const create = () => {
        Axios.post("http://localhost:5000/api/create", {
            name: userDetails.username,
            userId: userId,
            docName: docName
        }).then(res => {
            console.log(res);
            const url = `/doc/${res.data.id}/${userId}`;
            
            navigate(url);
        })
    }
    
    const join = () => {
        Axios.get("http://localhost:5000/api/join",{params:{name: userDetails.username,id: link,userId:userId}}).then(res => {
            console.log(res);
            if(res.data.status === 404){
                alert("Document not found");
            }
            const url = `/doc/${res.data.id}/${userId}`;
            navigate(url);
        }).catch(error => {
            console.log(error);
        });
    }
    
    return (
        <div className={styles.wrapper}>
            <div className={styles.createContainer}>
                <h1>Create</h1>
                <TextField id="outlined-basic" className={classes.textField} label="Document Name" onChange={(e)=>{setDocname(e.target.value)}} variant="outlined" required/>
                <Button onClick={create} variant="contained" color="secondary" className={classes.button}>Create</Button>
            </div>
            <div className={styles.joinContainer}>
                <h1>Join</h1>
                <TextField id="outlined-basic" className={classes.textField} label="Document Code" onChange={(e)=>{setLink(e.target.value)}} variant="outlined" required/>
                <Button onClick={join} variant="contained" color="secondary" className={classes.button}>Join</Button>
            </div>
        </div>
    );
}