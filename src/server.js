import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './configs/viewEngine';

import webRoutes from './routes/web';


let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//config view Engine
viewEngine(app);
webRoutes(app);


let port= 8080;
app.listen(port,()=>{
    console.log("app is running at the port"+port);
})