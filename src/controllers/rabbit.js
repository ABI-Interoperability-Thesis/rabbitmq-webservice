const amqp = require('amqplib')
const { GenerateRabbitURL } = require('../config/rabbitmq')
const rabbit_url = GenerateRabbitURL()

const GetURL = (req, res) => {
    return res.send(rabbit_url)
}

const PostMessageToRabbitMQ = async (req, res) => {
    console.log('Connecting to rabbitmq server')
    const connection = await amqp.connect(rabbit_url)
    const channel = await connection.createChannel();
    const queue_req = 'ml_requests'
    const queue_res = 'ml_responses'

    await channel.assertQueue(queue_req, { durable: true });
    await channel.assertQueue(queue_res, { durable: true });

    console.log('Sending message to queue ml_requests')
    channel.sendToQueue(queue_req, Buffer.from(JSON.stringify(req.body)));
    channel.close()

    return res.send('Message sent to RabbitMQ service')
}

module.exports = {
    GetURL: GetURL,
    PostMessageToRabbitMQ: PostMessageToRabbitMQ
}