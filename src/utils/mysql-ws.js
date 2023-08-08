require('dotenv').config();
const endpoints = require('../config/endpoints.json')
const axios = require('axios');
const runtime_env = process.env.ENV
const endpoint = process.env.MYSQL_SERVICE_ENDPOINT

const UpdateRequest = (req_id, answer) => {
    var data = JSON.stringify({
        "req_id": req_id,
        "answer": answer
    });

    var config = {
        method: 'put',
        url: `${endpoint}/api/update-request`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });

}

module.exports = { UpdateRequest }