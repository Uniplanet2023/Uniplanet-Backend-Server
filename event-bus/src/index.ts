import express from 'express'
import axios from 'axios'
import { randomBytes } from 'crypto'
import 'express-async-errors'
import cors from 'cors';

const app = express()
app.use(express.json())
app.use(cors());

app.post('/events',(req,res)=>{
    const {data} = req.body;
    console.log('come');
    // axios.post('http://posts-clusterip-srv:4000/events',data);
    res.send("good");
})

app.listen(4005, () => {
	console.log('Listening on 4005')
})