require('dotenv').config();
import { response } from "express";
import request from "request";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GIF_WELCOME = 'https://media0.giphy.com/media/yB24kCiUGWGyeMNpvd/giphy.gif?cid=ecf05e47ozuvigmjrv8p06l5ruxvayfpievnwgecgrsncwy3&ep=v1_gifs_search&rid=giphy.gif&ct=g'
const IMAGE_GET_STARTED = 'https://tse2.mm.bing.net/th?id=OIP.gKRH-WORVtuTkEQXfzJxeAHaE8&pid=Api&P=0'
const IMAGE_MAIN_MENU_2 = 'https://bit.ly/eric-bot-2'
const IMAGE_MAIN_MENU_3 = 'https://bit.ly/eric-bot-3'
const IMAGE_MAIN_MENU_4 = 'https://bit.ly/eric-bot-3'
const IMAGE_VIEW_APPETIZERS = 'http://bit.ly/eric-bot-5'
const IMAGE_VIEW_FISH = 'http://bit.ly/eric-bot-6'
const IMAGE_BACK_MAIN_MENU = 'http://bit.ly/eric-bot-8'

const IMAGE_DETAIL_ROOM = 'http://bit.ly/eric-bot-18'

const IMAGE_DETAIL_APPERTIZER_1 = 'http://bit.ly/eric-bot-9'
const IMAGE_DETAIL_APPERTIZER_2 = 'http://bit.ly/eric-bot-10'
const IMAGE_DETAIL_APPERTIZER_3 = 'http://bit.ly/eric-bot-11'

const IMAGE_DETAIL_FISH_1 = 'http://bit.ly/eric-bot-12'
const IMAGE_DETAIL_FISH_2 = 'http://bit.ly/eric-bot-13-1'
const IMAGE_DETAIL_FISH_3 = 'http://bit.ly/eric-bot-14'

const IMAGE_DETAIL_MEAT_1 = 'http://bit.ly/eric-bot-15'
const IMAGE_DETAIL_MEAT_2 = 'http://bit.ly/eric-bot-16'
const IMAGE_DETAIL_MEAT_3 = 'http://bit.ly/eric-bot-17'

const IMAGE_VIEW_MEAT = 'http://bit.ly/eric-bot-7'
let callSendAPI = async (sender_psid, response) => {
    //sender_psid laf nguoi nhan tin nhan 
    // Construct the message body
    return new Promise(async (resolve, reject) => {
        try {
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response
            };
            await sendMarkReadMessage(sender_psid);
            await sendTypingOn(sender_psid);
            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v9.0/me/messages",
                "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve('message sent!')  // resolve de out ra promise
                } else {
                    console.error("Unable to send message:" + err);
                }
            })
        } catch (error) {
                reject(error)
        }
    })


        ;
}
let sendTypingOn = (sender_psid,) => {
    //sender_psid laf nguoi nhan tin nhan 
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "typing_on",
    };
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('sent typing on!')
        } else {
            console.error("Unable to send TYPINGON message:" + err);
        }
    })
        ;
}
let sendMarkReadMessage = (sender_psid) => {
    //sender_psid laf nguoi nhan tin nhan 
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "mark_seen",
    };
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('sent typing on!')
        } else {
            console.error("Unable to send TYPINGON message:" + err);
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
    console.log('getstarted')
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid);
            let response1 = { "text": `OK.XIN CHAO ${username}  DEN VOI NHA HANG` }
            // let response2 = sendGetstartedTemplate();

            let response2 = getImageGetStartedTemplate();
            let response3 = sendGetstartedQuickRepli();

            //send text message
            await callSendAPI(sender_psid, response1)
            // send generic message
            await callSendAPI(sender_psid, response2)
            await callSendAPI(sender_psid, response3)
            resolve('done');

        } catch (e) {
            reject(e);
        }
    })
}
let sendGetstartedTemplate = () => {
    let response = {
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
                            "title": "Dat ban",
                            "payload": "RESERVE_TABLE",
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

    return response;
}
let getImageGetStartedTemplate = () => {
    let response = {
        "attachment": {
            "type": "image",
            "payload": {
                "url": IMAGE_GIF_WELCOME,
                "is_reusable": true
            }
        }
    }
    return response;

}
let sendGetstartedQuickRepli = () => {
    let response = {
        "text": "Duoi day la lua chon cua nha hang",
        "quick_replies": [
            {
                "content_type": "text",
                "title": "MENU CHINH",
                "payload": "MAIN_MENU",
                // "image_url":"http://example.com/img/red.png"
            },
            {
                "content_type": "text",
                "title": "Huong dan SD",
                "payload": "",
                // "image_url":"http://example.com/img/green.png"
            }
        ]
    }

    return response;
}
let handleSendMainMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getMainMenuTemplate(sender_psid);
            //send text message
            await callSendAPI(sender_psid, response1)
            // send generic messagea

        } catch (e) {
            reject(e);
        }
    })
}
let getMainMenuTemplate = (sender_psid) => {
    let response = {
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
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}/${sender_psid}`,
                                "title": "DATBAN",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true,
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

    return response;
}
let handleSendLunchMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getLunchMenuTemplate();
            //send text message
            await callSendAPI(sender_psid, response1)
            // send generic messagea

        } catch (e) {
            reject(e);
        }
    })
}
let handleSendDinnerMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getDinnerMenuTemplate();
            //send text message
            await callSendAPI(sender_psid, response1)
            // send generic messagea

        } catch (e) {
            reject(e);
        }
    })
}
let getLunchMenuTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Mon trang mien",
                        "subtitle": "Nha hang co nhieu mon trang mien hap dan .",
                        "image_url": IMAGE_VIEW_APPETIZERS,
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
                        "image_url": IMAGE_VIEW_FISH,
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
                        "image_url": IMAGE_VIEW_MEAT,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "CHI TIET",
                                "payload": "VIEW_MEAT",
                            },

                        ]
                    }, {
                        "title": "Quay tro lai",
                        "subtitle": "QUAY TRO LAI MENU CHINH",
                        "image_url": IMAGE_BACK_MAIN_MENU,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Quay tro lai",
                                "payload": "BACK_TO_MAIN_MENU",
                            },
                        ],
                    }]
            }
        }
    }

    return response

}
let getDinnerMenuTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Mon trang mien",
                        "subtitle": "Nha hang co nhieu mon trang mien hap dan .",
                        "image_url": IMAGE_VIEW_APPETIZERS,
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
                        "image_url": IMAGE_VIEW_FISH,
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
                        "image_url": IMAGE_VIEW_MEAT,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "CHI TIET",
                                "payload": "VIEW_MEAT",
                            },

                        ]
                    }, {
                        "title": "Quay tro lai",
                        "subtitle": "QUAY TRO LAI MENU CHINH",
                        "image_url": IMAGE_BACK_MAIN_MENU,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Quay tro lai",
                                "payload": "BACK_TO_MAIN_MENU",
                            },
                        ],
                    }]
            }
        }
    }

    return response
}

let handleBackToMainMenu = async (sender_psid) => {
    await handleSendMainMenu(sender_psid);
}
let getDetailViewAppetizer = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "DUA HAU",
                        "subtitle": "50ndt",
                        "image_url": IMAGE_DETAIL_APPERTIZER_1,

                    },
                    {
                        "title": "Xoai",
                        "subtitle": "10ndt",
                        "image_url": IMAGE_DETAIL_APPERTIZER_2,

                    },
                    {
                        "title": "Sau rieng",
                        "subtitle": "40ndt",
                        "image_url": IMAGE_DETAIL_APPERTIZER_3,
                    },
                    {
                        "title": "quay tro lai ",
                        "subtitle": "quay tro lai main menu",
                        "image_url": IMAGE_DETAIL_APPERTIZER_3,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Back to main menu",
                                "payload": "BACK_TO_MAIN_MENU",
                            },
                        ],
                    }
                ]
            }
        }
    }
    return response
}
let handleDetailViewAppetizer = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getDetailViewAppetizer();
            //send text message
            await callSendAPI(sender_psid, response1)
            // send generic messagea

        } catch (e) {
            reject(e);
        }
    })

}
let getDetailViewFish = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Ca voi xanh ",
                        "subtitle": "50ndt",
                        "image_url": IMAGE_DETAIL_FISH_1,

                    },
                    {
                        "title": "Ca ro phi",
                        "subtitle": "10ndt",
                        "image_url": IMAGE_DETAIL_FISH_2,

                    },
                    {
                        "title": "Ca loc",
                        "subtitle": "40ndt",
                        "image_url": IMAGE_DETAIL_FISH_3,
                    },
                    {
                        "title": "quay tro lai ",
                        "subtitle": "quay tro lai main menu",
                        "image_url": IMAGE_DETAIL_APPERTIZER_3,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Back to main menu",
                                "payload": "BACK_TO_MAIN_MENU",
                            },
                        ],
                    }
                ]
            }
        }
    }
    return response
}

let handleDetailViewFish = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getDetailViewFish();
            //send text message
            await callSendAPI(sender_psid, response1)
            // send generic messagea

        } catch (e) {
            reject(e);
        }
    })

}
let getDetailViewMeat = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "thit lon",
                        "subtitle": "50ndt",
                        "image_url": IMAGE_DETAIL_MEAT_1,

                    },
                    {
                        "title": "thit lon luoc",
                        "subtitle": "10ndt",
                        "image_url": IMAGE_DETAIL_MEAT_2,

                    },
                    {
                        "title": "thit lon CN",
                        "subtitle": "40ndt",
                        "image_url": IMAGE_DETAIL_MEAT_3,
                    },
                    {
                        "title": "quay tro lai ",
                        "subtitle": "quay tro lai main menu",
                        "image_url": IMAGE_DETAIL_APPERTIZER_3,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Back to main menu",
                                "payload": "BACK_TO_MAIN_MENU",
                            },
                        ],
                    }
                ]
            }
        }
    }
    return response
}
let handleDetailViewMeat = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getDetailViewMeat();
            //send text message
            await callSendAPI(sender_psid, response1)
            // send generic messagea

        } catch (e) {
            reject(e);
        }
    })

}
let getImageRooms = () => {
    let response = {
        "attachment": {
            "type": "image",
            "payload": {
                "url": IMAGE_DETAIL_ROOM,
                "is_reusable": true
            }
        }
    }
    return response;
}
let getButtonRooms = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Nha hang co the phuc vu toi da 300 khach",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "MEnuchinh",
                        "payload": "MAIN_MENU"
                    },
                    {
                        "type": "web_url",
                        "url": `https://eric-res-bot.herokuapp.com/reserve-table/`,
                        "title": "DATBAN",
                        "webview_height_ratio": "tall",
                        "messenger_extensions": true,
                    },
                    {
                        "type": "postback",
                        "title": "Huong dan su dung bot",
                        "payload": "GUIDE_TO_USE",
                    }

                ]
            }
        }
    }
    return response;
}
let handleshowDetailRooms = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            //send an image
            let response1 = getImageRooms();
            let response2 = getButtonRooms();
            //send text message
            await callSendAPI(sender_psid, response1)
            await callSendAPI(sender_psid, response2)
            // send generic messagea

        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    handleGetStarted: handleGetStarted,
    handleSendMainMenu: handleSendMainMenu,
    handleSendLunchMenu: handleSendLunchMenu,
    handleSendDinnerMenu: handleSendDinnerMenu,
    handleBackToMainMenu: handleBackToMainMenu,
    handleDetailViewAppetizer: handleDetailViewAppetizer,
    handleDetailViewFish: handleDetailViewFish,
    handleDetailViewMeat: handleDetailViewMeat,
    handleshowDetailRooms: handleshowDetailRooms,
    callSendAPI: callSendAPI,
    getUserName: getUserName,
}