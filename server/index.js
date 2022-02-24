const express = require('express');
app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

const dotenv = require('dotenv');
dotenv.config();

const DocRouter = require('./routes/docRoutes');
app.use('/api', DocRouter);

const userRouter = require('./routes/userRoutes');
app.use('/user', userRouter);

const Doc = require('./models/doc');
const User = require('./models/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT,() => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

require('./connect.js');

const io = require('socket.io')(6969,{
    cors: {
        origin: 'http://localhost:3000',
        method: ['GET','POST'],
    }
});
io.on('connection', (socket) => {
    
    socket.on('add-new-user-others',async (docId,userid) => {
        // console.log(userid);
        const user = await User.find({_id:userid});
        socket._id = userid;
        // console.log(user);
        socket.broadcast.to(docId).emit('add-new-user',user);
    });
    
    socket.on("get-doc",async docId => {
        socket.join(docId);

        const fetchedDoc = await Doc.findById({_id:docId});

        socket.emit("load-doc",fetchedDoc);

        socket.on('text-change', (delta,pos) => {
            socket.broadcast.to(docId).emit('fetch-changes',delta,pos);
        });
        socket.on('selection-change', (range,id) => {
            socket.broadcast.to(docId).emit('fetch-selection',range,id);
        });
        socket.on('save-doc',async (content) => {
            await Doc.findByIdAndUpdate({_id:docId},{content:content});
        });
        socket.on("disconnect",(reason) => {
            console.log(`${socket._id} is disconnecting because..`);
            console.log(reason);
            console.log('-----');
            socket.broadcast.to(docId).emit('disconnect-from-doc',socket._id);
        });
    });
    // socket.on("user-disconnection", async (docId,userid) => {
    //     socket.emit('disconnect-from-doc',docId,userid);
    // });
});



