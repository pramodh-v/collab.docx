const express = require('express');
const Doc = require('../models/doc');
const { v4: uuidv4 } = require('uuid');

const Router = express.Router();
Router.get('/',async (req,res)=>{
    console.log(req);
});
Router.post('/create', async (req, res) => {
    const { name, docName } = req.body;
    const doc = new Doc({
        _id: uuidv4(),
        title: docName,
        content: {},
        editors: []
    });
    try{
        const editor = {
            _id: uuidv4(),
            name: name,
            isOnline: true
        }
        await doc.editors.push(editor);
        doc.save();
        res.status(200).send({doc:doc,id:doc._id,user:editor,message:"Document created"});
    }
    catch(error){
        res.status(404).send({message:error});
    }
});

Router.get('/join',async (req,res) => {
    const { name, id } = req.query;
    try{
        console.log(id);
        const result = await Doc.findOne({_id:id});
        console.log(result);
        if(!result){
            res.status(404).send({message:"Document not found",status:404});
        }
        else{
            const editor = {
                _id: uuidv4(),
                name: name,
                isOnline: true
            }
            result.editors.push(editor);
            result.save();
            res.status(200).send({doc:result,id:result._id,user:editor,message:"Joined the document",status:200});
        }
    }
    catch(error){
        res.status(404).send({message:error,status:404});
    }
})

module.exports = Router;