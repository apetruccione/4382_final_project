// Our require (includes) for this file
var express = require('express');
var http = require('http');
var url = require("url");
var mongoose = require('mongoose');
var app = express();
var studentSchema = require('./studentSchema.js').studentSchema;
var jade = require("jade");
var bodyParser = require('body-parser');
var basicAuth = require("basic-auth-connect");

app.use(bodyParser.urlencoded({extended: true})); // to support URL-encoded bodies
// use basicAuth globally on our site

app.use(basicAuth(function(user, pass){
    return (user ==='admin' && pass ==='secret');
}));

// setup jade, views go in the views folder. Then make express use jade
app.set('views', './views');
app.set('view engine', 'jade');
app.engine('jade', jade.__express);


// setup our DB connection string
var connString = "mongodb://" + process.env.IP + ":27017/";
var dbName = "studentsDB";

// make a connectiont to a db through mongoose
mongoose.connect(connString + dbName);
// setup our student schema
var Student = mongoose.model('students', studentSchema);

// make our server listen on the special Cloud9 port.
http.createServer(app).listen(process.env.PORT);

app.on('close', function () {
  console.log("Closed");
  mongoose.disconnect();
});

/*
app.get('/', function(req, res) {    
    res.send('Hello, welcome to the students DB.');
   
});*/ // Default route removed, the students list will also handle the default route.

app.get('/students/byID', function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var response = 'Finding Student: ' + query.studentID;
    
    console.log('\nQuery URL: ' + req.originalUrl);
    console.log(query.studentID);
  
    var search = Student.find({'studentID': query.studentID});
    search.exec(function(err, docs) {
    if (err) {
        console.log(err);
    }
    //console.log(JSON.stringify(docs));
    //console.log(docs[0]);

    res.render('student_form', {result: docs[0]});
    });

    
});

app.get(['/','/students/'], function(req, res) {

  
    var search = Student.find();
    search.exec(function(err, docs) {
    if (err) {
        console.log(err);
    }

    res.render('all_students2', {result: docs});
    });

    
});

app.get('/createStudent/', function(req, res) {

   res.render('create_student');
    
});

app.post('/editStudent/', function(req, res) {

    console.log("Got to edit method.");
    var fname = req.body.fname;
    var lname = req.body.lname;
    var classification = req.body.classification;
    var studentID = req.body.studentID;
    console.log(fname);
    console.log(lname);
    console.log(classification);
    console.log(studentID);
    
    Student.findOne({
        studentID: studentID
    }, function(err, doc) {
        doc.fname = fname;
        doc.lname = lname;
        doc.classification = classification;
        doc.save();
        res.redirect('./students'); 
    });
    
});


app.post('/addStudent/', function(req, res) {

    console.log("Got to add method.");
    var fname = req.body.fname;
    var lname = req.body.lname;
    var classification = req.body.classification;
    console.log(fname);
    console.log(lname);
    console.log(classification);


    var hightesID = 0;
    Student.find(function(err,docs)
    {
      for (var i in docs){
          for (var k = 0; k<docs.length; k++)
          {
              if(docs[i].studentID > hightesID)
              {
                hightesID = docs[i].studentID;   
              }
              
          }
      }
      
    }); 
    
    setTimeout(function() {
        hightesID +=1;
        var newStudent = {
            fname: fname,
            lname: lname,
            classification: classification,
            studentID: hightesID
        };
        
        Student.create(newStudent,function(err){
            console.log("It worked");
            res.redirect('./students'); 
        });

    }, 2000);


    
});

app.post('/deleteStudent/', function(req, res) {

    console.log("Got to delete method.");
    var fname = req.body.fname;
    var lname = req.body.lname;
    var classification = req.body.classification;
    var studentID = req.body.studentID;
    console.log(fname);
    console.log(lname);
    console.log(classification);
    console.log(studentID);
    
    Student.findOne({
        studentID: studentID
    }, function(err, doc) {
        doc.remove();
    });
    res.redirect('./students');
});

