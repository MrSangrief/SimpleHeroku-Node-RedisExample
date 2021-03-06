var redis = require("redis"),
    redis_url = process.env.REDIS_URL || "",
    client = redis.createClient(redis_url),
    port = process.env.PORT || 8080,
    express = require("express"),
    app = express(),
    path = require("path"),
    db = require("./db.js"),
    User = require("./models/User.js");

client.on("error", function(error){
    console.log("Error" + error);
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
    res.render("index");
});

app.route("/mssql")
.get(function(req, res){
    User.findAll().then(function(err, result){
        console.log("error:" + err); 
        console.log("result:" + result); 
    });
    res.send("done");
});


app.get("/nmsc", function(req, res){
    var doneMessage = "responded to get on /nmsc from ";
    client.get("user:username1", function(error, result){
        var response = {
            source : "Redis" 
        };
        
        var nmscData;
        if(!result){
            response.source = "TAAS";
            nmscData = {
                nmsc:"aeaeae"
            };
            client.set("user:username1", JSON.stringify(nmscData));
        }
        else{
            nmscData = JSON.parse(result);
        }
        response.data = nmscData;
        res.send(response);
        console.log(doneMessage + response.source);
    });
});
app.get("/nmsc/delete", function(req, res){
    var doneMessage = "reponded to get on /nmsc/delete. Nmscdata has been deleted from Redis.";
    client.del("user:username1", function(){
        res.send("Nmsc deleted from Redis") ;
        console.log(doneMessage);
    });
});

app.listen(port, function(){
    console.log("Our app is running on http://localhost:" + port);
});