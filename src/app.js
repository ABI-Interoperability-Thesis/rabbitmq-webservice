const express = require('express')
require('dotenv').config();
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger/swagger.json')
const app = express()
const port = process.env.PORT || 3000
const {listenToRabbitMQ} = require('./config/rabbitmq')

app.use(express.json())

// Landing Page for the webservice
app.get('/', (req,res)=>res.send('RabbitMQ Webservice #2'))


//Routing /api requests to the api router
const apiRoutes = require('./routes/rabbit')
app.use('/api/rabbitmq', apiRoutes)

//Routing to Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Catch unrouted requests to 404
app.use((req, res, next) => {
    const error = new Error('Route not Found')
    error.status = 404
    next(error)
  })

app.listen(port, async ()=>{
    console.log(`RabbitMQ Webservice listening in port ${port}`)
    await listenToRabbitMQ().catch(console.error);
})