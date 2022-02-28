import React, { useCallback, useEffect } from 'react';
import { useState } from  "react";
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import 'quill/dist/quill.snow.css';
import '../../App.js';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Fab,makeStyles } from '@material-ui/core';

Quill.register('modules/cursors', QuillCursors);

const modules = {
    cursors: true,
    toolbar: [
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script:  "sub" }, { script:  "super" }],
        ["blockquote", "code-block"],
        [{ list:  "ordered" }, { list:  "bullet" }],
        [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
        ["link", "image", "video"],
        ["clean"],
    ],
}
const TextEditor = () => {
  const useStyles = makeStyles(() => ({
    fab: {
      position: 'fixed', 
      bottom: '50%',
      right: '20px',
      backgroundColor: '#00a896',
      color: 'white',
      '&:hover': {
        backgroundColor: 'secondary',
        color: 'white',
      },
    },
    editors: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      transition: 'all 0.5s',
    },
    docLink: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      width: '50%',
      margin: '0 auto',
      backgroundColor: '#d0d0d0',
      '&:hover': {
        backgroundColor: '#e0e0e0',
      },
    },
    circle: {
      fontSize: '5px',
    }
  }));
  const classes = useStyles();

    const [socket,setSocket] = useState();
    const [quill,setQuill] = useState();
    const [cursors,setCursors] = useState();
    const [users,setUsers] = useState();
    const [isCopied,setIsCopied] = useState(false);
    const [docName,setDocName] = useState();

    const userDetails = JSON.parse(Cookies.get('userDetails'));
    const userid = userDetails._id;

    const { id:docId,userId:userId } = useParams();
    const colors = ["red","blue","pink","green","yellow","orange"];

    const list = document.getElementById('editors-list');
    const editorsList = (list,users) => {
      list.innerHTML = "";
      users.forEach((user,index) => {
        const li = document.createElement('li');
        li.style.listStyleType = 'none';
        li.style.margin = '0';
        li.style.padding = '10px';
        li.innerHTML = "<span style='font-size:10px'>"+(`${user.isOnline}`?'🟢':'🔴')+"</span>"+`${user.username}`;
        list.appendChild(li);
      });
      users.forEach((editor,index) => {
        cursors.createCursor(editor._id,editor.username,colors[index%colors.length]);
      });
    }
    // Initialise Socket
    useEffect(() => {
      const Sock = io("http://localhost:6969");
      Sock.on("connect",() => {
          Sock.emit("add-new-user-others",docId,userid);
      });
      setSocket(Sock);
      return () => {
        Sock.disconnect();
      }
    },[]);
    // Load Document
    useEffect(() => {
      if(!socket||!quill||!cursors)
        return;
      socket.once("load-doc",(document) => {
        setDocName(document.title);
        quill.setContents(document.content);  
        setUsers(document.editors);
        editorsList(list,document.editors);
      })
      socket.emit("get-doc",docId);
    },[socket,quill,docId]);
    // Listen for changes
    useEffect(() => {
      if(!socket||!quill)
        return;
      const helper = function(delta, oldDelta, source) {
        if(source!=='user')
          return;
        socket.emit("text-change",delta,quill.getSelection(),userId);
        socket.emit("save-doc",quill.getContents());
      };
      quill.on('text-change',helper);
      return () => {
        quill.off('text-change',helper);
      }
    },[socket,quill,cursors]);
    // Fetch changes from others
    useEffect(() => {
      if(!socket||!quill)
        return;
      const helper = function(delta,pos,id) {
        quill.updateContents(delta);
        cursors.moveCursor(id,pos);
      };
      socket.on('fetch-changes',helper);
      return () => {
        socket.off('fetch-changes',helper);
      }
    },[socket,quill]);
    // Fetch cursor selection from others
    useEffect(() => {
      if(!socket||!quill)
        return;
      socket.on('fetch-selection',(pos,id) => {
        cursors.moveCursor(id,pos);
      });
      return () => {
        socket.off('fetch-selection');
      }
    },[socket,quill]);
    // Change cursor selection
    useEffect(() => {
      if(!socket||!quill)
        return;
      quill.on('selection-change',(range) => {
        socket.emit("selection-change",range,userId);
      })
      return () => {
        quill.off('selection-change');
      }
    },[socket,quill]);
    // Update Users real-time
    useEffect(() => {
      if(!users)
        return;
      const helper = function(editors) {
        setUsers(editors);
        editorsList(list,editors);
      };
      socket.on("add-new-user",helper);
      return () => {
        socket.off("add-new-user",helper);
      }
    },[users]);
    // Disconnect user from doc
    useEffect(() => {
      if(!users||!cursors)
        return;
      socket.on('disconnect-from-doc',(userId) => {
        let dup = users;
        dup.forEach((user,index) => {
          if(user._id===userId) {
            user.isOnline = false;
          }
        });
        setUsers(dup);
        cursors.removeCursor(userId);
        editorsList(list,users);
      });
    },[users,cursors]);
    // Initialise Quill
    const x = useCallback((container) => {
      if(container==null)
        return
      container.innerHTML = "";
      const editor = document.createElement('div');
      container.appendChild(editor);
      const q = new Quill(editor, {
        modules: modules,
        theme: 'snow'
      });
      setQuill(q);

      const c = q.getModule('cursors');
      setCursors(c);
      q.focus();
    },[]);
  return (
    <div className="quill-wrapper">
      <div className="title-container-for-doc">
        <h1>{docName}</h1>
      </div>
      <div className={classes.docLink} onClick={() => {navigator.clipboard.writeText(docId);setIsCopied(true);}}>
        <p>{(!isCopied)?"Click on the code to copy it to the clipboard!":"Copied"}</p>
        <h3>{docId}</h3></div>
      <div className={classes.editors} id="editors-list"></div>
      <div className="editor-container" ref={x}></div>
      {/* <Fab className={classes.fab} onClick={() => { if(!showEditors){setShowEditors(true);}else{setShowEditors(false);} console.log(showEditors);}}>
      <img src={require("./users.png")} alt="logo" className="logo"/>
      </Fab> */}
    </div>
  )
}

export default TextEditor
