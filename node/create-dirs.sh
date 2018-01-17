#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

const arr = [
    "R4-XIR7b-Qo",
    "3DC9Y2BqyuU",
    "gQgrKG6Q0BI",
    "6Cs5a4wpOyw",
    "IuNslnL6EGs",
    "C9KF6EdS9-8",
    "31Mn9CMhVVo",
    "RbhnkPS3MDQ",
    "lmiJKfX_DiE",
    "3Q_Uq1GwA0c",
    "5GqJb_mzFIo",
    "ZU1tN3c-dEs",
    "n4qS3lwYICE",
    "pl2lljkJZqc",
    "yiTHpe33Fy0",
    "rjzEolVYv0M",
    "9ACjSl5XH7k"
  ]
  arr.forEach(id=>{
    try{
        fs.mkdirSync(path.join(__dirname, "..", `client/dist/videos/${id}`))
    }catch(e){

    }
    try{
        fs.mkdirSync(path.join(__dirname, "..", `client/src/json/${id}`))
    }catch(e){

    }
  })