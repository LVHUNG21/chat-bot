require('dotenv').config();
import { response } from "express";
import request from "request";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED='https://tse2.mm.bing.net/th?id=OIP.gKRH-WORVtuTkEQXfzJxeAHaE8&pid=Api&P=0'
const IMAGE_MAIN_MENU_2='http://bit.ly/eric-bot-2'
const IMAGE_MAIN_MENU_3='http://bit.ly/eric-bot-3'
const IMAGE_MAIN_MENU_4='http://bit.ly/eric-bot-4'
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
                                "title": "MENU CHINH",
                                "payload": "MAIN_MENU",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "DAT_BAN",
                            },
                            {
                                "type": "postback",
                                "title": "HUONG DAN SU DUNG CHAT BOT",
                                "payload": "HUONG_DAN",
                            }
                        ],
                    }]
                }
            }
    }

    return  response;
}
let handleSendMainMenu=(sender_psid)=>{
    return new Promise(async (resolve, reject) => {
        try {
            let response1=getMainMenuTemplate();
            //send text message
            await callSendAPI(sender_psid, response1)
            // send generic messagea

        } catch (e) {
            reject(e);
        }
    })
}
let getMainMenuTemplate=()=>{
     let response={  
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                        "title": "Menu cua nha hang",
                        "subtitle": "chung toi han hanh mang den dich vu.",
                        "image_url": IMAGE_MAIN_MENU_2,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Bua trua",
                                "payload": "LUNCH_MENU",
                            },
                            {
                                "type": "postback",
                                "title": "BUA TOI",
                                "payload": "DINNER_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "HUONG DAN SU DUNG CHAT BOT",
                                "payload": "HUONG_DAN",
                            }
                        ],
                    },
                       {
                        "title": "Gio mo cua",
                        "subtitle": "T2-t6 10am-11am ",
                        "image_url": IMAGE_MAIN_MENU_3,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Dat ban",
                                "payload": "RESERVE_TABLE",
                            },
                        ],
                    },
                       {
                        "title": "KHONG GIAN NHA HANG",
                        "subtitle": "restaurant accommodates up to 300 seated",
                        "image_url": IMAGE_MAIN_MENU_4,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "CHI TIET",
                                "payload": "SHOW_ROOM",
                            },
                        ],
                    }
                ]
                }
            }
    }

    return  response;
}
let handleSendLunchMenu =(sender_psid)=>{
    return new Promise(async (resolve, reject) => {
        try {
            let response1=getLunchMenuTemplate();
            //send text message
            await callSendAPI(sender_psid, response1)
            // send generic messagea

        } catch (e) {
            reject(e);
        }
    })
}
let handleSendDinnerMenu=(sender_psid)=>{
    return new Promise(async (resolve, reject) => {
        try {
            let response1=getDinnerMenuTemplate();
            //send text message
            await callSendAPI(sender_psid, response1)
            // send generic messagea

        } catch (e) {
            reject(e);
        }
    })
}
let getLunchMenuTemplate=()=>{
    let response={  
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                    "title": "Mon trang mien",
                    "subtitle": "Nha hang co nhieu mon trang mien hap dan .",
                    "image_url": IMAGE_MAIN_MENU_2,
                    "buttons": [
                        {
                            //appertizers
                            "type": "postback",
                            "title": "Xem Chi Tiet",
                            "payload": "VIEW_APPETIZERS",
                        },
                    ],
                },
                   {
                    "title": "ca bay mau",
                    "subtitle": "ca nuoc ngot va ca nuoc man",
                    "image_url": IMAGE_MAIN_MENU_3,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiet",
                            "payload": "VIEW_FISH",
                        },
                    ],
                },
                   {
                    "title": "Thit hun khoi",
                    "subtitle": "dam bao chat luong",
                    "image_url": IMAGE_MAIN_MENU_4,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "CHI TIET",
                            "payload": "VIEW_MEAT",
                        },
                    ],
                }
            ]
            }
        }
}
return response

}
let getDinnerMenuTemplate=()=>{
    let response={  
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                    "title": "Menu cua nha hang",
                    "subtitle": "chung toi han hanh mang den dich vu.",
                    "image_url": IMAGE_MAIN_MENU_2,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Bua trua",
                            "payload": "LUNCH_MENU",
                        },
                        {
                            "type": "postback",
                            "title": "BUA TOI",
                            "payload": "DINNER_MENU"
                        },
                        {
                            "type": "postback",
                            "title": "HUONG DAN SU DUNG CHAT BOT",
                            "payload": "HUONG_DAN",
                        }
                    ],
                },
                   {
                    "title": "Gio mo cua",
                    "subtitle": "T2-t6 10am-11am ",
                    "image_url": IMAGE_MAIN_MENU_3,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Dat ban",
                            "payload": "RESERVE_TABLE",
                        },
                    ],
                },
                   {
                    "title": "KHONG GIAN NHA HANG",
                    "subtitle": "restaurant accommodates up to 300 seated",
                    "image_url": IMAGE_MAIN_MENU_4,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "CHI TIET",
                            "payload": "SHOW_ROOM",
                        },
                    ],
                }
            ]
            }
        }
}
return response
}
module.exports = {
    handleGetStarted: handleGetStarted,
    handleSendMainMenu:handleSendMainMenu,
    handleSendLunchMenu:handleSendLunchMenu,
    handleSendDinnerMenu:handleSendDinnerMenu,
}