var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session: expressSession});
var mongoose = require('mongoose');
var connString = "mongodb://" + process.env.IP + ":27017/";
var dbName = "users";
var db = mongoose.connect(connString + dbName);
//require('./models/students_model.js');
//var conn = mongoose.connect('mongodb://'+process.env.IP+'/myapp');
var app = express();
var studentSchema = require('./models/students_model.js').StudentSchema;
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var Student = mongoose.model('Student', studentSchema);
// close mongoose connection on app close
app.on('close', function () {
  console.log("Closed");
  mongoose.disconnect();
});
/*app.use(expressSession({
  secret: 'SECRET',
  cookie: {maxAge: 60*60*1000},
  store: new mongoStore({
      db: mongoose.connection.db,
      collection: 'sessions'
    })
  }));*/
// require('./routes')(app);
app.listen(process.env.PORT, process.env.IP);

app.get('/students/', function(req, res) {

  
    var search = Student.find();
    search.exec(function(err, docs) {
    if (err) {
        console.log(err);
    }

    res.render('index', {result: docs});
    });

    
});