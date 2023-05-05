require('dotenv').config();
import chatBotService from '../services/chatbotService'
import request from "request";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
let getHomePage = (req, res) => {
    return res.render('homepage.ejs')
};
let getWebhook = (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge']; // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

let postWebhook = (req, res) => {
    // Parse the request body from the POST
    broadcastMessage('broadCasmessage')
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

};
let handleMessage = (sender_psid, received_message) => {
    let response;

    // Checks if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
        }
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
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
    }
    // Send the response message
    callSendAPI(sender_psid, response);
};

// Handles messaging_postbacks events
let handlePostback = async (sender_psid, received_postback) => {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;
    switch (payload) {
        case 'yes':
            response = { "text": "Thanks!" }
            break;
        case 'no':
            response = { "text": "Oops, try sending another image." }
            break;
        case 'GET_STARTED':
            await chatBotService.handleGetStarted(sender_psid);
            broadcastMessage('AUTOSENDMEssageALLcustomer');
            break;
        // case 'auto':
        //     broadcastMessage('AUTOSENDMEssageALLcustomer');
        //     break;
        case 'no':
            //code 
            break;
        default:
            response = { 'text': `oop ! i don't know response with postback ${payload}` }

        // code block
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
};
let broadcastMessage = (message) => {
    let requestBody = {
        messaging_type: 'MESSAGE_TAG',
        tag: 'NON_PROMOTIONAL_SUBSCRIPTION',
        message: message
    };

    let options = {
        url: `https://graph.facebook.com/v12.0/me/broadcast_messages?access_token=${PAGE_ACCESS_TOKEN}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    };

    request(options, (err, res, body) => {
        console.log(body);
        if (err) {
            console.error('Error sending broadcast message:', err);
        } else {
            console.log('Broadcast message sent successfully:', body);
        }
    });
}
// Sends response messages via the Send API
let callSendAPI = (sender_psid, response) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

//template string
let setupProfile = async (req, res) => {
    //call profile facebook api
    let request_body = {
        "get_started": { "payload": "GET_STARTED" },
        "whitelisted_domains": ["https://eric-res-bot.herokuapp.com/"],
    };
    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v16.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log(body)
        if (!err) {
            console.log('setup user profile succeds')
        } else {
            console.error("Unable to setup message:" + err);
        }
    });
    return res.send("setup user profile succeds!");


}

module.exports = {
    getHomePage: getHomePage,
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    setupProfile: setupProfile,
    broadcastMessage: broadcastMessage

}