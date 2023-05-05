require('dotenv').config();
import { response } from "express";
import request from "request";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED='https://tse2.mm.bing.net/th?id=OIP.gKRH-WORVtuTkEQXfzJxeAHaE8&pid=Api&P=0'
let callSendAPI = (sender_psid, response) => {
    //sender_psid laf nguoi nhan tin nhan 
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    })
        ;
}
let getUserName = (sender_psid) => {
    return new Promise((resolve, reject) => {
        request({
            "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}>`,
            "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
            "method": "GET",
        }, (err, res, body) => {
            console.log(body);
            if (!err) {
                body = JSON.parse(body);
                // "first_name":"le",
                // "last_name":"hung"
                let username = `${body.first_name} ${body.last_name}`
                resolve(username);
            } else {
                console.error("Unable to send message:" + err);
                reject(err)
            }
        })
            
    })

}
let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid);
            let response1 = { "text": `OK.XIN CHAO ${username}  DEN VOI NHA HANG` }
            let response2=sendGetstartedTemplate();
            //send text message
            await callSendAPI(sender_psid, response1)
            // send generic message
            await callSendAPI(sender_psid, response2)
            resolve('done');

        } catch (e) {
            reject(e);
        }
    })
}
let sendGetstartedTemplate=()=>{
    let response={  
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
    }

    return  response;
}
module.exports = {
    handleGetStarted: handleGetStarted
}