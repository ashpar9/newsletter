const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

const app = express();



app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);


  const url = "https://us21.api.mailchimp.com/3.0/lists/d294704844";
  const options = {
    method: "POST",
    auth: "Ashish9:a414de45850dc9d66910ea1f9c2aea4b2-us21"
  }

  const requests = https.request(url, options, function(response) {

    if (response.statusCode === 200 ){
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on(data, function(data) {
      console.log(JSON.parse(data));
    })
  })

  requests.write(jsonData);
  requests.end();

});


app.post("/failure", function(req, res){
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});

// API Key
// 414de45850dc9d66910ea1f9c2aea4b2-us21

// List ID
// d294704844
