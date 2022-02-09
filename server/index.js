const express = require('express');
app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

const dotenv = require('dotenv');
dotenv.config();

const Router = require('./routes/docRoutes');
app.use('/api', Router);

const Doc = require('./models/doc');

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
    console.log('someone connected!');
    socket.on("get-doc",async docId => {
        socket.join(docId);
        const fetchedDoc = await Doc.findById({_id:docId});
        socket.emit("load-doc",fetchedDoc);

        socket.on('text-change', (delta,pos) => {
            socket.broadcast.to(docId).emit('fetch-changes',delta,pos);
        });

        socket.on('selection-change', (range,id) => {
            console.log(range);
            socket.broadcast.to(docId).emit('fetch-selection',range,id);
        });
        socket.on('save-doc',async (content) => {
            await Doc.findByIdAndUpdate({_id:docId},{content:content});
        });
    });
});



