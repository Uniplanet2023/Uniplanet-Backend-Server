import { EmailSender, NodemailerEmailApi } from "./email-sender";
import UserCreatedConsumer from "./event/consumer/UserCreatedConsumer";

import dotenv from 'dotenv-safe'

if(process.env.NODE_ENV! == 'production'){
	const parsedNodeEnv = process.env.NODE_ENV || 'example'
	dotenv.config({
		path: parsedNodeEnv.trim() === 'production' ? '.env.production' : 'development' ? '.env.dev' : '.env.example',
	})
}
const start  = async () =>{
    const emailSender = EmailSender.getInstance()
    emailSender.activate()
    // emailSender.setEmailApi(new NodemailerEmailApi())
    //     const { status, hash } = await emailSender.sendSignUpVerificationEmail({
    //         name: 'test',
    //         toEmail: 'qkrtlwp1111@gmail.com',
    //     })    
    // try{
    //     kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string]);
    //     const userCreatedConsumer = new UserCreatedConsumer(kafkaClient.kafka,"usercreated");
    //     console.log('kafka connecting ... ')

    //     await userCreatedConsumer.connect();

    // }catch(err){
    //     console.error(err);
    // }
};

import express from 'express'
const app = express()
// middleware
app.use(express.json())

const PORT = process.env.PORT || 3003

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
    start();
})
