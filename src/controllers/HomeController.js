require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
import axios from 'axios'
import chatBotService from '../services/chatbotService'
import request from "request";
import moment from 'moment/moment';
const SPEADSHEET_ID=process.env.SPEADSHEET_ID
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const GOOGLE_SERVICE_ACCOUNT_EMAIL=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY=process.env.GOOGLE_PRIVATE_KEY;
const PAGE_ID = '117732067976138';
let getHomePage = (req, res) => {
    console.log('checkhomepage')
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
let writeDataToGoogleSheet =async (data)=>{
    let currentDate=new Date();
    const format= "HH:mm DD/MM/YYYY";
    const formatedDate=moment(currentDate).format(format);    

    const doc = new GoogleSpreadsheet(SPEADSHEET_ID);
    await doc.useServiceAccountAuth({
  // env var values are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  client_email: JSON.parse(`"${GOOGLE_SERVICE_ACCOUNT_EMAIL}"`),
  private_key: JSON.parse(`"${GOOGLE_PRIVATE_KEY}"`),
});

await doc.loadInfo(); // loads document properties and worksheets
const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

await sheet.addRow({
    "Namefb":data.username,
    "Email":data.email,
    "SDT":`'`+data.phoneNumber, //dau ' giup sheet hieu sdt la string va lay ca so 0
    'Time':formatedDate,
    'Name':data.customerName,
})
// adding / removing sheets
const newSheet = await doc.addSheet({ title: 'hot new sheet!' });
await newSheet.delete();

}
async function getFollowers() {
    const response = await axios.get(
        `https://graph.facebook.com/v12.0/${PAGE_ID}/subscribed_apps`,
        {
            params: { access_token: PAGE_ACCESS_TOKEN },
        }
    );
    console.log('HUNG FOLLOWER')
    return response.data.data;
}

// Hàm gửi tin nhắn đến một người dùng
async function sendMessage(message) {
    const response = await axios.post(
        `https://graph.facebook.com/v12.0/${PAGE_ID}/messages`,
        {
            recipient: { id: recipientId },
            message: { text: message },
        },
        {
            params: { access_token: PAGE_ACCESS_TOKEN },
        }
    );
    return response.data;
}

// Hàm gửi tin nhắn đến tất cả người theo dõi trang của bạn
async function sendMessagesToFollowers() {
    const followers = await getFollowers();
    const message = 'Chào mừng đến với fanpage của chúng tôi!';
    for (const follower of followers) {
        await sendMessage(follower.id, message);
    }
}
let postWebhook = (req, res) => {
    // Parse the request body from the POST
    // broadcastMessage('broadCasmessage')
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
let handleMessage = async (sender_psid, received_message) => {
    let response;

    //check message for quick replies 
        if(received_message.quick_reply && received_message.quick_reply.payload){
               if(received_message.quick_reply.payload==='MAIN_MENU') {
                 await chatBotService.handleSendMainMenu(sender_psid);
               }
            return ;
        }
    if (received_message.text) {
    // Checks if the message contains text
        //check message for quick replies 


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
        case 'RESTART_BOT':
        case 'GET_STARTED':
            await chatBotService.handleGetStarted(sender_psid);
            // await getFollowers();
            // sendMessage('ALO')

            // broadcastMessage('AUTOSENDMEssageALLcustomer');
            break;
        // case 'auto':
        //     broadcastMessage('AUTOSENDMEssageALLcustomer');
        //     break;
        case 'MAIN_MENU':
            await chatBotService.handleSendMainMenu(sender_psid);
            //code 
            break;
        case 'LUNCH_MENU':
            await chatBotService.handleSendLunchMenu(sender_psid);
            //code 
            break;
        case 'DINNER_MENU':
            await chatBotService.handleSendDinnerMenu(sender_psid);
            //code 
            break;

        case 'VIEW_APPETIZERS':
            await chatBotService.handleDetailViewAppetizer(sender_psid)
        case 'VIEW_FISH':
            await chatBotService.handleDetailViewFish(sender_psid)
        case 'VIEW_MEAT':
            await chatBotService.handleDetailViewMeat(sender_psid);
            break;
        case 'BACK_TO_MAIN_MENU':
            await chatBotService.handleBackToMainMenu(sender_psid);
            break;
        case 'SHOW_ROOM':
            await chatBotService.handleshowDetailRooms(sender_psid);
            break;
        case 'RESERVE_TABLE':
            await chatBotService.handleshowDetailRooms(sender_psid);
            break;
        default:
            response = { 'text': `oop ! i don't know response with postback ${payload}` }

        // code block
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
};
async function sendBroadcastMessage(message) {
    const response = await axios.post(
        'https://graph.facebook.com/v12.0/me/broadcast_messages',
        {
            messaging_type: 'MESSAGE_TAG',
            tag: 'CONFIRMED_EVENT_UPDATE',
            message: {
                text: message,
            },
            custom_label_id: 'YOUR_CUSTOM_LABEL_ID', // Thay YOUR_CUSTOM_LABEL_ID bằng ID của nhãn tùy chỉnh
        },
        {
            params: { access_token: ACCESS_TOKEN },
        }
    );
    return response.data;
}

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
        "uri": `https://graph.facebook.com/v9.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log('body:', body)
        if (!err) {
            console.log('setup user profile succeds')
        } else {
            console.error("Unable to setup message:" + err);
        }
    });
    return res.send("setup user profile succeds!");


}

let setupPersistentMenu = async (req, res) => {
    let request_body =
    {
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "postback",
                        "title": "Talk to an agent",
                        "payload": "VIEW_YOUTUBE_CHANNEL"
                    },
                    {
                        "type": "postback",
                        "title": "khoi dong lai bot",
                        "payload": "RESTART_BOT"
                    },
                    {
                        "type": "web_url",
                        "title": "WEBSITE",
                        "webview_height_ratio": "full",
                        "url": "http://youtube.com"
                    }
                ]
            }
        ]
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
            console.log('setup permisstion user profile succeds')
        } else {
            console.error("Unable to setup permisstion message:" + err);
        }
    });
    return res.send("setup permisstion user profile succeds!");


}
let handleReserveTable = (req, res) => {
    let senderId=req.params.senderId;
    console.log('senderId',senderId);
    return res.render('reserve_table.ejs',{
        senderId:senderId
    })
}
let handlePostReserveTable = async (req, res) => {

    try {
        let username=await chatBotService.getUserName(req.body.psid);
        let data={
            username:username,
            email:req.body.email,
            phoneNumber:req.body.phoneNumber,
            customerName:req.body.customerName
        }
        await writeDataToGoogleSheet(data);
        let customerName = "";
        if (req.body.customerName === "") {
            customerName = await chatBotService.getUserName(req.body.psid);
        } else customerName = req.body.customerName;

        // I demo response with sample text
        // you can check database for customer order's status

        let response1 = {
            "text": `---Info about your lookup order---
            \nCustomer name: ${customerName}
            \nEmail address: ${req.body.email}
            \nOrder number: ${req.body.phoneNumber}
            `
        };

        await chatBotService.callSendAPI(req.body.psid, response1);

        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
        console.log('loi post reserve table:', e)
        return res.status(500).json({
            message: "server error"
        });
    }

}

module.exports = {
    getHomePage: getHomePage,
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    setupProfile: setupProfile,
    setupPersistentMenu: setupPersistentMenu,
    handleReserveTable: handleReserveTable,
    handlePostReserveTable: handlePostReserveTable
}