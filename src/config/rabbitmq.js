require('dotenv').config();
const amqp = require('amqplib')
const endpoints = require('./endpoints.json')
const {UpdateRequest} = require('../utils/mysql-ws')

const runtime_env = process.env.ENV
const rabbit_user = process.env.RABBIT_USERNAME
const rabbit_password = process.env.RABBIT_PASSWORD

const endpoint = process.env.RABBIT_MQ_HOST
const rabbit_url = `amqp://${rabbit_user}:${rabbit_password}@${endpoint}`

const GenerateRabbitURL = () => {
    return rabbit_url
}

const checkRabbitMQServer = async () => {
    let connection
    while (true) {
        console.log(rabbit_url)
        try {
        connection = await amqp.connect(rabbit_url);
        console.log('RabbitMQ server is running and connected.');
        break;
      } catch (err) {
        console.log('RabbitMQ server is not yet running. Retrying in 1 seconds...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  
    return connection
  };
  
  const listenToRabbitMQ = async () => {
    console.log(`Connecting to ${rabbit_url}`)
    const connection = await checkRabbitMQServer()
    const channel = await connection.createChannel();
  
    const exchange = 'ml_exchange';
    const queue = 'ml_responses';
    const queue_req = 'ml_requests';
  
    await channel.assertExchange(exchange, 'direct', { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.assertQueue(queue_req, { durable: true });
    await channel.bindQueue(queue, exchange, queue);
  
    console.log(`Listening to the "${queue}" queue...`);
  
    channel.consume(queue, async (message) => {
        console.log('msg received')
      const response = JSON.parse(message.content.toString());
      console.log(response)
      UpdateRequest(response.req_id, response.answer)
    }, { noAck: true });
  }
  


module.exports = {
    GenerateRabbitURL: GenerateRabbitURL, 
    listenToRabbitMQ: listenToRabbitMQ
}