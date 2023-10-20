require('dotenv').config();
const axios = require('axios');
const express = require('express');
const parser = require('body-parser');
const app = express().use(parser.json());

// system verification token (from config file)
const sys_verify_token = process.env.Token;

app.listen(process.env.PORT, ()=>{
    console.log(`App is up and listen to port ${process.env.PORT}`);
});

// Subscribe method
app.get('/webhook', (req, res)=>{
    let hubMode = req.query['hub.mode'];
    let hub_challenge = req.query['hub.challenge'];
    let hub_verify_token = req.query['hub.verify_token'];

    if(hubMode === 'subscribe' & hub_verify_token === sys_verify_token){
        console.log('log from get /webhook for subscribtion endpoint');
        console.log(req);
        res.status(200).send(hub_challenge);
    }
    else{
        res.status(403);
    }
});

// Send message method
app.post('/webhook', (req, res)=>{
    console.log('log from post /webhook send message endpoint');
    console.log(JSON.stringify(req.body.entry[0].changes));

    let data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": `${req.body.entry[0].changes[0].value.messages[0].from}`,
        "type": "text",
        "text": {
          "preview_url": false,
          "body": `This is test message ${req.body.entry[0].changes[0].value.messages[0].text.body}`
        }
    });
      
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://graph.facebook.com/${process.env.VERSION}/${req.body.entry[0].changes[0].value.metadata.phone_number_id}/messages`,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${process.env.User_Access_Token}`
        },
        data : data
    };
      
    axios.request(config).then((response) => {
        console.log(JSON.stringify(response.data));
    }).catch((error) => {
        console.log(error);
    });
    console.log('================================================')
});

app.get('/', (req,res)=>{
    res.status(200).send('App is runing...')
});