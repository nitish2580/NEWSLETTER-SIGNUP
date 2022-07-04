const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { url } = require("inspector");
const { urlToHttpOptions } = require("url");
const { response } = require("express");
const { request } = require("http");
// const request = require("request");
// app.use(express.static(__dirname));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
  // res.send(__dirname+"signup.html")
});

app.post("/", (req, res) =>
 {
  const firstName = req.body.first;
  const lastName = req.body.last;
  const Email = req.body.email;
//   res.send("" + firstName);
  var data = {
    members: [
      {
        email_address: Email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us11.api.mailchimp.com/3.0/lists/b8d4a35b34";
  const options = {
    method: "POST",
    auth: "nitish:641b4b726cfff351b76130c2c3a8d867-us11",
  };
  const request=https.request(url, options, (response) => {

    if(response.statusCode==200){
        res.sendFile(__dirname+"/success.html")
    }
    else{
        res.sendFile(__dirname+"/failure.html")
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure",(req,res)=>{
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Server successfully running");
});


