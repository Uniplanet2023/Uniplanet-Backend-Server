import express from 'express'
import { randomBytes } from 'crypto'
import 'express-async-errors'
import cors from 'cors';
import axios from 'axios';

const app = express()
app.use(express.json())
app.use(cors());

type Post = {
	id: string
	title: string
}
let posts: { [key: string]: Post } = {};

app.get('/posts', (req, res) => {
	res.send(posts)
})

app.post('/posts', async(req, res) => {
	const id = randomBytes(4).toString('hex')
	const { title } = req.body

	posts[id] = {
		id,
		title,
	}
	console.log('send');
	await axios.post('http://event-bus-srv:4005/events',{
		type:'PostCreated',
		data:{
			id,
			title
		}
	})
	res.status(201).send(posts[id])
})
app.post('/events',(req,res)=>{
	console.log(req.body);
	res.send('ok');
})
app.listen(4000, () => {
	console.log('v56');
	console.log('Listening on 4000')
})
