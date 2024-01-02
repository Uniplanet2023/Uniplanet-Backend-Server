import mongoose from 'mongoose'
import app from './app'
import { UserDeleteScheduler } from './scheduler'
import { EmailSender, NodemailerEmailApi } from '@uniplanet-lib/common'
import { natsWrapper } from './nats_wrapper'
import { TicketCreatedPublisher } from './events/publisher/ticket-created-publisher'

const PORT = process.env.PORT || 3000

const emailSender = EmailSender.getInstance()

emailSender.activate()
emailSender.setEmailApi(new NodemailerEmailApi())


app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
	if (!process.env.JWT_TOKEN_SECRET) {
		throw new Error('JWT_TOKEN_SECRET tocken have to be define')
	}
	if (!process.env.SMTP_HOST) {
		throw new Error('SMTP_HOST tocken have to be define')
	}
	if (!process.env.SMTP_PORT) {
		throw new Error('SMTP_PORT tocken have to be define')
	}
	if(!process.env.MONGO_DB_HOST){
		throw new Error('MONGO_DB_HOST tocken have to be define')
	}
	if(!process.env.MONGO_DB_NAME){
		throw new Error('MONGO_DB_NAME tocken have to be define')
	}
	if(!process.env.NATS_CLUSTER_ID){
		throw new Error('NATS_CLUSTER_ID tocken have to be define')
	}
	if(!process.env.NATS_CLIENT_ID){
		throw new Error('NATS_CLIENT_ID tocken have to be define')
	}
	if(!process.env.NATS_URL){
		throw new Error('NATS_URL tocken have to be define')
	}
	await natsWrapper.connect(process.env.NATS_CLUSTER_ID as string, process.env.NATS_CLIENT_ID as string, process.env.NATS_URL as string)
	    
    natsWrapper.client.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () =>natsWrapper.client.close());
	await new TicketCreatedPublisher(natsWrapper.client).publish({
		id: "test",
		title: 'test',
		price: 19,
		userId: 'test',
	});
	await mongoose.connect(`${process.env.MONGO_DB_HOST as string}/${process.env.MONGO_DB_NAME}`).then(() => {
		console.log('DB connection!!')
		new UserDeleteScheduler().taskInitializer()
		
	})
})
