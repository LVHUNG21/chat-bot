import express from 'express';
import HomeController from '../controllers/HomeController';
let router=express.Router();

let initWebRoutes=(app)=>{
    router.get("/", HomeController.getHomePage
    )
    router.post('/webhook',HomeController.postWebhook)
    router.get('/webhook',HomeController.getWebhook)
    router.get('/reserve-table/:senderId',HomeController.handleReserveTable)
    router.post('/reserve-table-ajax',HomeController.handlePostReserveTable)
    //setup get started button , whitelisted domain
    router.post('/setup-profile',HomeController.setupProfile)

    //setup persistent menu
    router.post('/setup-persistent-menu',HomeController.setupPersistentMenu)

    // router.post('/sendAllCustomer',HomeController.broadcastMessage)
    return app.use('/',router);
}
module.exports=initWebRoutes;