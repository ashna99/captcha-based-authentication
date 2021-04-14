var router = require("express").Router();
var app = require('express');
var axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
//body-parser deprecated... middlewares are now part of express as methods 
app.json();
app.urlencoded({ extended: false });
console.log('hi');
router.post("/signup-with-recaptcha", (req, res) => {
  console.log(req.body);
  if (!req.body.token) {
    return res.status(400).json({ error: "reCaptcha token is missing" });
  }

  const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.reCaptchaSecret}&response=${req.body.token}`;
  //make a request to verify url
  axios.post(googleVerifyUrl)
  .then((response)=>{
    console.log(response);
       if(response.data.success){
        return res.status(200).json({ success: true });
       }
       else{
        return res.status(200).json({ error: "Invalid Captcha. Try again." }); 
       }
  })
  .catch((e)=>{
    return res.status(400).json({ error: "reCaptcha error." });
  })
});

module.exports = router;
