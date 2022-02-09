import React,{ useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [docName,setDocname] = useState("");
    const [link, setLink] = useState("");

    const create = () => {
        Axios.post("http://localhost:5000/api/create", {
            name: name,
            docName: docName
        }).then(res => {
            console.log(res);
            const url = `/doc/${res.data.id}/${res.data.user._id}`;
            // const userDetails = res.data.user;
            // localStorage.setItem("userDetails",JSON.stringify(userDetails));
            // localStorage.getItem(JSON.parse("userDetails"));
            navigate(url);
        })
    }
    
    const join = () => {
        Axios.get("http://localhost:5000/api/join",{params:{name: name,id: link}}).then(res => {
            console.log(res);
            if(res.data.status === 404){
                alert("Document not found");
            }
            const url = `/doc/${res.data.id}/${res.data.user._id}`;
            // const userDetails = res.data.user;
            // console.log(userDetails);
            // localStorage.setItem("userDetails",JSON.stringify(userDetails));
            navigate(url);
        }).catch(error => {
            console.log(error);
        });
    }
    
    return (
        <div className="home">
            {console.log("Home")}
            <div className="name_container">
                <h1>Name</h1>
                <input type="text" placeholder="Name" onChange={(e) => {setName(e.target.value)}}/>
            </div>
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