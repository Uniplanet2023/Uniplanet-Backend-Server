import express from 'express'
import { randomBytes } from 'crypto'
import 'express-async-errors'
import cors from 'cors';

const app = express()
app.use(express.json())
app.use(cors());

type Comment = {
	id: string
	content: string
}
let commentsByPostId: {[key: string]:Comment[]}  = {};

app.get('/posts/:id/comments', (req, res) => {
	res.send(commentsByPostId[req.params.id] || []);
})

app.post('/posts/:id/comments', (req, res) => {
	const commentsId = randomBytes(4).toString('hex')
	const { content } = req.body

	const comments = commentsByPostId[req.params.id] || [];

    comments.push({id:commentsId, content});
    
    commentsByPostId[req.params.id] = comments;

	res.status(201).send(comments)
})

app.listen(4001, () => {
	console.log('Listening on 4001')
})
