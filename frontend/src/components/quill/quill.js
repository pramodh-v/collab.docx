import React, { useCallback, useEffect } from 'react';
import { useState } from  "react";
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import 'quill/dist/quill.snow.css';
import '../../App.js';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

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
    const [socket,setSocket] = useState();
    const [quill,setQuill] = useState();
    const [cursors,setCursors] = useState();
    const [users,setUsers] = useState();

    const userDetails = JSON.parse(Cookies.get('userDetails'));
    const userid = userDetails._id;

    const { id:docId,userId:userId } = useParams();
    const colors = ["red","blue","pink","green","yellow","orange"];

    const list = document.getElementById('editors-list');

    const editorsList = (list,users) => {
      list.innerHTML = "";
      users.forEach((user,index) => {
        const li = document.createElement('li');
        li.innerHTML = user.username;
        list.appendChild(li);
      });
      users.forEach((editor,index) => {
        cursors.createCursor(editor._id,editor.name,colors[index%colors.length]);
      });
    }
    // Initialise Socket
    useEffect(() => {
      const Sock = io("http://localhost:6969");
      Sock.on("connect",() => {
          // Sock.emit("user-connection",docId,userid);
          Sock.emit("add-new-user-others",docId,userid);
      });
      setSocket(Sock);
      return () => {
        // Sock.emit("user-disconnection",docId,userid);
        console.log('---');
        Sock.disconnect();
      }
    },[]);
    // Load Document
    useEffect(() => {
      if(!socket||!quill||!cursors)
        return;
      socket.once("load-doc",(document) => {
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
        // console.log(cursors);
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
        // console.log(cursors);
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
        // console.log(range);
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
      const helper = function(user) {
        let dup = users;
        if(!users.find(u => u._id===user.id)) {
          dup.push(user[0]);
          setUsers(dup);
          // console.log(users);
          editorsList(list,users);
        }
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
        console.log(userId);
        let dup = users;
        dup.forEach((user,index) => {
          // console.log(user);
          if(user._id===userId) {
            dup.splice(index,1);
          }
        });
        setUsers(dup);
        console.log(users);
        cursors.removeCursor(userId);
        console.log(cursors);
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
    <div className="wrapper">
      <div className="title-container-for-doc">
        <h3>Text Editor</h3>
      </div>
      <div id="editors-list"></div>
      <div className="editor-container" ref={x}></div>
    </div>
  )
}

export default TextEditor
