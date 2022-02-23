import React,{ useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Home() {
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
        <div className="home">
            {console.log("Home")}
            <div className="create_container">
                <h1>Create</h1>
                <input type="text" placeholder="Create a new document" onChange={(e) => {setDocname(e.target.value)}}/>
                <button onClick={create}>Create</button>
            </div>
            <div className="join_container">
                <h1>Join</h1>
                <input type="text" placeholder="Enter your Code" onChange={(e) => {setLink(e.target.value)}}/>
                <button onClick={join}>Join</button>
            </div>
        </div>
    );
}