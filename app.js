var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var index = require('./routes/index');
var users = require('./routes/users');
var session=require('express-session');
var app = express();

var jan,arif;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use(session({
    secret:"It is a secret cookisfsfdsdfsaf2344e",
    resave:true,
    saveUninitialized : true,
    secure : true
}));

/* catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//database code


*/



var MongoClient = require('mongodb').MongoClient;
//var mongodb=require("mongodb");
var url = "mongodb://localhost:27017/MongoDatabase2";
var mydb;
var m1,m2,i;

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    mydb = db;

    //var myobj = { name: "Ajeet Kumar", age: "28", address: "Delhi" };
  /*	 UnableUnableUnableUnableUnableUnableUnableUnable
   */
});

//------------------------------------------------------------
function register1(response,req,res){
    var flag2=0;
    result=res;
    m1=response.mail;
    mydb.collection("Users").findOne({mail:response.mail},function(err,result){
        if(err) throw err;
        else if(result){
            flag2=1;
        }

        if(!flag2){
            console.log("Sorry User Doesn't Exist");
            res.redirect("/");


        }
        else{
            mydb.collection("Tasks").find({mail1:m1}).toArray(function(err,result){
                if(err) throw err;
                req.session.mail=m1;
                res.render('Todo',{uname:req.session.mail,tasks:result});


            });
        }

    });

}


//----------------------------------------------------------
function register2(response,res){
    var flag=0;

    mydb.collection("Users").findOne({mail:response.mail},function(err,result){
        if(err) throw err;
        else if(result){
            flag=1;

        }
        if(!flag){res.redirect("/");
            mydb.collection("Users").insertOne(response, function(err, res) {
                if (err) throw err;
                console.log("1 record inserted");



            });
        }
        else { res.redirect("/process_post2");console.log(" User Already Exist");}
    });

}
//-------------------------------------------------------------

function register3(response,req,result1){
    response.mail1=m1;

    req.session.mail=m1;
    mydb.collection("Tasks").insertOne(response, function(err, res) {
        if (err) throw err;
        mydb.collection("Tasks").find({mail1:m1}).toArray(function(err,result){
            if(err) throw err;
            req.session.mail=m1;
            result1.render('Todo',{uname:req.session.mail,tasks:result});


        });
    });
}


//------------------------Deletion-------------------------------


app.use('/delete',function(req,res){

    var id = new mongodb.ObjectId(req.body.taskId);
    console.log(id);
    mydb.collection("Tasks").removeOne({_id:id});

    mydb.collection("Tasks").find({mail1:m1}).toArray(function(err,result){
        if(err) throw err;
        req.session.mail=m1;
        res.render('Todo',{uname:req.session.mail,tasks:result});


    });

});


//-------------------------  Updation  --------------------------------------

app.use('/updateTask',urlencodedParser, function(req,res){
    var id = new mongodb.ObjectId(req.body.utaskId);
    console.log(id);
    req.session.uname=m1;

    var username = req.session.uname;
    var title = req.body.title;
    var time = req.body.dttm;
    var desc = req.body.desc;
    var status = req.body.stats;
    if(req.session.uname) {
        updateTask(username, id, title, time, desc, status, function (err, result1) {
            if (err) return console.log("Error occured while adding new task");
            else{
                mydb.collection("Tasks").find({mail1:m1}).toArray(function(err,result){
                    if(err) throw err;
                    req.session.mail=m1;
                    res.render('Todo',{uname:req.session.mail,tasks:result});


                });
            }
        });
    }

});

function updateTask(username,id,title,time,desc,status,callback){
    mydb.collection("Tasks").updateOne({_id:id},{$set:{mail1:username,title:title,datetime:time,description:desc,status:status}}, function (err, result) {
        if (err) return console.log("Error occured");
        callback(err,result);
    });
}


//--------------------------------------------------------------------------------------------------------


var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.render("Login2.ejs");
});
app.get('/process_post2', function (req, res) {
    res.render("SignUp2.ejs" );
});
app.get('/process_post3', function (req, res) {
    if(!req.session.mail){
        console.log("not created");
    }
    console.log(req.session.mail);
    res.render('Todo.ejs');
});

app.post('/process_post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        mail:req.body.uname,
        password:req.body.psw
    };

    // console.log(response);
    register1(response,req,res);

    //res.end(JSON.stringify(response));
});
app.post('/process_post2', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response2 = {
        user_name:req.body.uname1,
        mail:req.body.mail11,
        password:req.body.pswd
    };
    //console.log(response2);

    register2(response2,res);

    //res.end(JSON.stringify(response2));
});



app.post('/process_post3', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    req.session.mail=m1;
    response3 = {


        title:req.body.title,
        datetime:req.body.dttm,
        description:req.body.desc,
        status: 'Not Done'

    };
    //console.log(response3);
    register3(response3,req,res);

 //   res.render('Todo',{uname:req.session.mail,tasks:jan});

    // res.end(JSON.stringify(response3));
  // res.redirect("/process_post3");
});


var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port)
});


//database code end

module.exports = app;
