import React, { useCallback, useEffect } from 'react';
import { useState } from  "react";
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import 'quill/dist/quill.snow.css';
import '../../App.js';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

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

    useEffect(() => {
      const Sock = io("http://localhost:6969");
      Sock.on("connect",() => {
          Sock.emit("user-connection",{docId:docId});
      });
      setSocket(Sock);
      return () => {
          Sock.disconnect();
      }
    },[]);

    const { id:docId,userId:userId } = useParams();
    const colors = ["red","blue","pink","green","yellow","orange"];

    useEffect(() => {
      if(!socket||!quill||!cursors)
        return;
      socket.once("load-doc",(document) => {
        quill.setContents(document.content);
        console.log(document.editors);
        console.log(quill.getSelection());
        document.editors.forEach((editor,index) => {
          console.log(editor._id);
          cursors.createCursor(editor._id,editor.name,colors[index%colors.length]);
          cursors.moveCursor(editor._id,index);
        });
        console.log(cursors);
      })
      socket.emit("get-doc",docId);
    },[socket,quill,docId]);

    useEffect(() => {
      if(!socket||!quill)
        return;
      const helper = function(delta, oldDelta, source) {
        if(source!=='user')
          return;
        console.log(cursors);
        socket.emit("text-change",delta,quill.getSelection(),userId);
        socket.emit("save-doc",quill.getContents());
      };
      quill.on('text-change',helper);
      return () => {
        quill.off('text-change',helper);
      }
    },[socket,quill,cursors]);

    useEffect(() => {
      if(!socket||!quill)
        return;
      const helper = function(delta,pos,id) {
        quill.updateContents(delta);
        console.log(cursors);
        cursors.moveCursor(id,pos);
      };
      socket.on('fetch-changes',helper);
      return () => {
        quill.off('fetch-changes',helper);
      }
    },[socket,quill]);

    useEffect(() => {
      if(!socket||!quill)
        return;
      socket.on('fetch-selection',(pos,id) => {
        console.log(id);
        console.log(pos);
        cursors.moveCursor(id,pos);
      });
      return () => {
        socket.off('fetch-selection');
      }
    },[socket,quill]);
    useEffect(() => {
      if(!socket||!quill)
        return;
      quill.on('selection-change',(range) => {
        console.log(range);
        socket.emit("selection-change",range,userId);
      })
      return () => {
        quill.off('selection-change');
      }
    },[socket,quill]);
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
      // c.createCursor(userId,userId,'black');
      q.focus();
    },[]);
  return (
    <div className="wrapper">
      <div className="title-container-for-doc">
        <h3>Text Editor</h3>
      </div>
      <div className="editor-container" ref={x}></div>
    </div>
  )
}

export default TextEditor
