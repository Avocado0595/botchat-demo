import login from "facebook-chat-api";
import fs from 'fs';
import axios from 'axios';
import queryString from 'query-string';
import dotenv from 'dotenv';
dotenv.config();
const credential = fs.readFileSync('./credential.json',{encoding:'utf8'});
const axiosClient = axios.create({
    baseURL: 'https://api.simsimi.net/v2',
    headers: {
        'content-type':'application/json',
    },
    paramsSerializer: params => queryString.stringify(params),
});

login({appState:JSON.parse(credential),email: process.env.EMAIL, password: process.env.PASSWORD}, (err, api) => {
    if(err) return console.error(err);
    try{
        api.listenMqtt( async(err, message) => {
        if(message && message.body){
            const params = {};
            params.text = message.body;
            params.lc='vn';
            const response = await axiosClient.get('/',{params})
            api.sendMessage(response.data.success, message.threadID);
       }
});}
catch{
    api.sendMessage("khum trả lời dc òi =(((", message.threadID);
}
});



