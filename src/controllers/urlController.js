// packages needed in this file
const shortid = require('shortid')
const urlModel = require('../models/urlModel')
const redis = require("redis")

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    15228,
    "redis-15228.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("ZmbyDpNOfkuxm128M238YptOt37UDyVV", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  });

//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

// # 1. - Check whether the body is empty
const isValidReqBody = function (reqBody) {
    return Object.keys(reqBody).length > 0;
}

// # 2. - Check whether the value is empty or blank
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false;   //Checks whether the value is null or undefined
    if (typeof value === 'string' && value.trim().length === 0) return false;// Checks whether the value is an empty string
    return true
}

const createshorturl = async function (req, res) {
    try {

        if (!isValidReqBody(req.body)) {
            return res.status(400).send({ status: false, message: "Please provide details to action further", });
        }

        const { longUrl } = req.body // destructure the longUrl from req.body.longUrl

        if (!isValid(longUrl)) {
            return res.status(400).send({ status: false, message: "Please Provide URL to shortern", });
        }

        //check url if valid {
            const regex =  (/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i)
        if (!regex.test(longUrl)) {
            res.status(400).send({ status: false, msg: "the url is invalid, Please give correct url" })
        } else{
        let cahcedUrlData = await GET_ASYNC(`${longUrl}`)
        if (cahcedUrlData){
            console.log("Data stored from caches")
        res.status(200).send({status :true , data:json.parse(cahcedUrlData)})
        // check Duplicate url
        } else {
        const duplicateUrl = await urlModel.findOne({ longUrl }).select({ _id: 0, updatedAt: 0, createdAt: 0, _v: 0 })
        if (duplicateUrl) {
            res.status(200).send({ msg: "the url is already shortened before", data: duplicateUrl })
        }
        else {
            // The API base Url endpoint
            const baseUrl = 'http://localhost:3000'
            // if valid, we create the url code
            //const urlCode = shortid.generate().toLowerCase()
            // join the generated short code the the base url

            const length = 6
            let urlCode = '';
            const characters = 'abcdefghijklmnopqrstuvwxyz';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                urlCode += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            const shortUrl = baseUrl + '/' + urlCode
            // invoking the Url model and saving to the DB
            let url = {
                longUrl,
                shortUrl,
                urlCode
            }
            const saveurl = await urlModel.create(url)
            await SET_ASYNC(`${url}`, JSON.stringify(url))
            console.log("Data stored from DB")
            res.status(200).send({ status: true, data: url })
         }
       }
    }
}
    // exception handler
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: error.message });
    }
}

const getredirecturl = async function (req, res) {
    try {
        const urlCodeFromPath = req.params.urlCode
        if(!isValid(urlCodeFromPath)){
            res.status(400).send({status:false, msg: "Please provide correct urlCode"})
        } else{
        let cachedData = await GET_ASYNC(`${urlCodeFromPath}`)
        if (cachedData){
            console.log("stored data pulled from cache")
         res.status(302).redirect(JSON.parse(cachedData))
        } else {
            const urlFound = await urlModel.findOne({ urlCode:urlCodeFromPath})
        if (urlFound) {
            console.log("stored data pulled from DB")
            await SET_ASYNC(`${urlCodeFromPath}`, JSON.stringify(urlFound.longUrl))
         res.status(302).redirect(urlFound.longUrl)
          }
        else {
            return res.status(404).send("no url found")
        }
    } 
   }
}
catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = {
    createshorturl,
    getredirecturl
}



// const createshorturl = async function (req, res) {
//     try {
//         const { longUrl } = req.body // destructure the longUrl from req.body.longUrl

//         //check url if valid {
//             const regex =  (/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i)
//         if (!regex.test(longUrl)) {
//             res.status(400).send({ status: false, msg: "the url is invalid, Please give correct url" })
//         }

//         // check Duplicate url 
//         const duplicateUrl = await urlModel.findOne({ longUrl }).select({ _id: 0, updatedAt: 0, createdAt: 0, _v: 0 })
//         if (duplicateUrl) {
//             res.status(400).send({ msg: "the url is already shortened before", data: duplicateUrl })
//         }
//         else {
//             // The API base Url endpoint
//             const baseUrl = 'http://localhost:3000'
//             // if valid, we create the url code
//             //const urlCode = shortid.generate().toLowerCase()
//             // join the generated short code the the base url

//             const length = 6
//             let urlCode = '';
//             const characters = 'abcdefghijklmnopqrstuvwxyz';
//             const charactersLength = characters.length;
//             for (let i = 0; i < length; i++) {
//                 urlCode += characters.charAt(Math.floor(Math.random() * charactersLength));
//             }
//             const shortUrl = baseUrl + '/' + urlCode
//             // invoking the Url model and saving to the DB
//             let url = {
//                 longUrl,
//                 shortUrl,
//                 urlCode
//             }
//             const saveurl = await urlModel.create(url)
//             res.status(200).send({ status: true, data: url })
//         }
//     }
//     // exception handler
//     catch (err) {
//         console.log(err)
//         res.status(500).send('Server Error')
//     }
// }

// const fetchShortenUrl = async function (req, res) {
//     let cahcedUrlData = await GET_ASYNC(`${req.params.urlId}`)
//     if(cahcedUrlData) {
//       res.send(cahcedUrlData)
//     } else {
//       let url = await urlModel.findById(req.params.urlId);
//       await SET_ASYNC(`${req.params.urlId}`, JSON.stringify(url))
//       res.send({ data: url });
//     }
  
//   };

// const getredirecturl = async function (req, res) {
//     try {
//         const urlFound = await urlModel.findOne({ urlCode: req.params.urlCode })
//         if (urlFound) {
//             return res.redirect(urlFound.longUrl)
//         }
//         else {
//             return res.status(400).send({ msg: "no url found" })
//         }
//     } catch (err) {
//         console.log(err)
//         res.status(500).send('Server Error')
//     }
// };
