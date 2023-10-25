// add config file
require('dotenv').config();

// import required backages
const ejs = require('ejs');
const http = require('http');
const axios = require('axios');
const express = require('express');
const socketIo = require('socket.io');
const parser = require('body-parser');
const app = express().use(parser.json());

const server = http.createServer(app);
const io = socketIo(server);

let socket;


app.use(express.static('static'));
app.set('view engine', 'ejs');

// system verification token (from config file)
const sys_verify_token = process.env.Token;

server.listen(process.env.PORT, ()=>{
    console.log(`App is up and listen to port ${process.env.PORT}`);
});

// Subscribe method
app.get('/webhook', (req, res)=>{
    let hubMode = req.query['hub.mode'];
    let hub_challenge = req.query['hub.challenge'];
    let hub_verify_token = req.query['hub.verify_token'];

    if(hubMode === 'subscribe' && hub_verify_token === sys_verify_token){
        console.log('log from get /webhook for subscribtion endpoint');
        console.log(req);
        res.status(200).send(hub_challenge);
    }
    else{
        res.sendStatus(403);
    }
    return;
});

// Send message method
app.post('/webhook', (req, res)=>{
    console.log('log from post /webhook send message endpoint');
    console.log(JSON.stringify(req.body, null, 2));
    
    if(req.body.object && req.body.entry){
        console.log('request body contain object and entry parameters');

        if(
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0].value &&
            req.body.entry[0].changes[0].value.messages &&
            req.body.entry[0].changes[0].value.messages[0].from
        ){
            // let data = JSON.stringify({
            //     "messaging_product": "whatsapp",
            //     "recipient_type": "individual",
            //     "to": `${req.body.entry[0].changes[0].value.messages[0].from}`,
            //     "type": "text",
            //     "text": {
            //       "preview_url": false,
            //       "body": `This is test message ${req.body.entry[0].changes[0].value.messages[0].text.body}`
            //     }
            // });
              
            // let config = {
            //     method: 'post',
            //     maxBodyLength: Infinity,
            //     url: `https://graph.facebook.com/${process.env.VERSION}/${req.body.entry[0].changes[0].value.metadata.phone_number_id}/messages`,
            //     headers: { 
            //         'Content-Type': 'application/json', 
            //         'Authorization': `Bearer ${process.env.User_Access_Token}`
            //     },
            //     data : data
            // };
              
            
            // axios.request(config).then((response) => {
            //     console.log('================hello from axios ========================')
            //     console.log(JSON.stringify(response.data));
            //     res.sendStatus(200);
            // }).catch((error) => {
            //     console.log(error);
            //     res.sendStatus(501);
            // });
            this.socket.emit('sendMessage', {
                value: req.body.entry[0].changes[0].value.messages[0].text.body
            });

        } else{
            
        }
        res.sendStatus(200);
        console.log('================================================');
    }else{
        console.log('Some of object or entry prameters are messing or map to false value.');
        console.log(`Object prameter (value): ${req.body.object}`);
        console.log(`Entry prameter (value): ${req.body.entry}`);
    }
    return;
});

app.get('/', (req,res)=>{
    res.render('pages/index');
});

io.on('connection', (socket) => {
    console.log('A user connected');
    this.socket = socket;

    // You can emit messages to the connected clients here
    socket.on('sendMessage', (message) => {
        // Process the message and if needed save it in data store
        // Then emit it to the UI
        console.log(message);

        // "to": `${req.body.entry[0].changes[0].value.messages[0].from}`
        // "body": `This is test message ${req.body.entry[0].changes[0].value.messages[0].text.body}`
        // ${req.body.entry[0].changes[0].value.metadata.phone_number_id}
        let data = JSON.stringify({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": '01143290414',
            "type": "text",
            "text": {
              "preview_url": false,
              "body": message
            }
        });
          
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://graph.facebook.com/${process.env.VERSION}/151878724665167/messages`,
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${process.env.User_Access_Token}`
            },
            data : data
        };
          
        
        axios.request(config).then((response) => {
            console.log('================hello from axios ========================')
            console.log(JSON.stringify(response.data));
            // res.sendStatus(200);
        }).catch((error) => {
            console.log(error);
            // res.sendStatus(501);
        });



    });

    socket.emit('sendMessage', {
        value: 'Hello how can I help you (this is an auto sent message'
    });
});


const possibleMessages = [
    {message:'', response: ''}
];

function chatbotAutoResponse(message){
    possibleMessages.filter(val => val.message.toLowerCase().includes(message.toLowerCase()));
}