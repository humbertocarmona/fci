import express from 'express';
// import './dbSetup.js';

const app = express();
app.listen(3000, ()=>{
    console.log('server is running on port 3000');
});

app.use(express.static('public'))
