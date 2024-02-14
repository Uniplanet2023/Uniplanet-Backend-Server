import { EmailSender, NodemailerEmailApi } from "./email-sender";
import UserCreatedConsumer from "./event/consumer/UserCreatedConsumer";
import express from 'express'
import cookieSession from 'cookie-session'
import { kafkaClient } from "./kafka-client";

// import dotenv from 'dotenv-safe'

// if(process.env.NODE_ENV! == 'production'){
// 	const parsedNodeEnv = process.env.NODE_ENV || 'example'
// 	dotenv.config({
// 		path: parsedNodeEnv.trim() === 'production' ? '.env.production' : 'development' ? '.env.dev' : '.env.example',
// 	})
// }
const start  = async () =>{
    const emailSender = EmailSender.getInstance()
    emailSender.activate()
    try{
        kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string]);
        const userCreatedConsumer = new UserCreatedConsumer(kafkaClient.kafka,"usercreated");
        console.log('kafka connecting ... ')

        await userCreatedConsumer.connect();

    }catch(err){
        console.error(err);
    }
};



const app = express()
app.set('trust proxy', true) // proxy ingress nginx

// middleware
app.use(express.json())
app.use(
	cookieSession({
		signed: false,
		secure: false,
	}),
)
// middleware
app.use(express.json())

const PORT = process.env.PORT || 3003

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
    start();
})