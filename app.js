const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
var mock = 0; //used for testing

var app = express();
app.set('view engine', 'ejs');
var registered = 0;
// var app = express(); //creates an instance of the node express server
app.use(express.static("public")) //refres links to static files such as images and css to a folder named "public"
app.use(bodyParser.urlencoded({extended: true})); //easliy parse input
app.listen(process.env.PORT || 3000 , function() { //starts server on the a process defined port or 3000
  console.log("server is running on port 3000");

})

app.get("/", function(req, res) { //returns a page when server recive a get-request with no specific page/
  //res.sendFile(__dirname + "/signup.html");
  console.log("page was requested, registeration status:" + registered);

  res.render("signup",{wasRegistered:registered})
  registered = 0;
});
app.post("/", function(req, res) {
  console.log("recived a sgin-up request:");

  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var inputEmail = req.body.inputEmail;
  console.log(" firstname: " + firstName + "\n lastname: " + lastName + "\n e-mail: " + inputEmail);

  var data = {
    members: [
      {
        email_address: inputEmail,
        status: "subscribed",
        email_type : "html",
         merge_fields : {
        FNAME :firstName,
         LNAME : lastName
       }

      }

    ]
  };
  var Jsondata = JSON.stringify(data);
  var options = {
    url: "https://mailchimp_dc.com/3.0/lists/your_list_id",
    method: "POST",
    headers: {
      Authorization: "Mickey mailchimp_api_key", //this api-key was revoked, don't waste your time ;)

    },
    body: Jsondata
  };
  if (mock == 0) {
  request(options, function(error, response, body) {
    console.log("processing request");
    if (error) {
      console.log(error);
      res.sendFile(__dirname + "/failure.html")
    } else {
      if(response.statusCode != 200)
      {
        console.log(response.statusCode + "\n");
        console.log("request failed, request data: \n" +Jsondata);
        console.log("response: \n" + response.body);
        res.sendFile(__dirname + "/failure.html");

      }
      if(response.statusCode == 200)
      {
        console.log(response.statusCode + "\n");
        console.log("member added sucessfuly, request data: \n" +Jsondata);
        registered = 1;
        res.redirect("/");
      }
    }

  });
}
else{
  console.log("mocking a sucessful request")
  registered = 1;
  res.redirect("/");


}
})
//api key
//
//list key
//
