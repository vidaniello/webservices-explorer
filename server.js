#!/usr/bin/env node

const express = require('express');
const httpstatuscodes = require('http-status-codes')
const package = require('./package.json');

const app = express();

/** @type {number} */
const defPort = 3030;



app.use(express.json());
app.listen(defPort, ()=>{
    console.log("Http-server listen on port "+defPort)
});



app.get("/", (req,resp)=>{
    resp.send("Ok! ver. "+package.version+", date "+new Date());
});