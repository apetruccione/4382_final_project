//bring in the module
var mongoose = require('mongoose');

var connString = "mongodb://" + process.env.IP + ":27017/";
var dbName = "users";

//connect
var db = mongoose.connect(connString + dbName);

//get the schema - notice how we use the export
var studentSchema = require('./models/students_model.js').StudentSchema;

var Student = mongoose.model('Student', studentSchema);

setTimeout(function() {
    mongoose.disconnect();
}, 5000);

//again, once is the event-handling "hook" for when the database is opened
mongoose.connection.once('open', function() {

    //we create a new instance off the Model object
    var s1 = new Student({
        username: "Jbabb",
        fname: "Jeff",
        lname: "Babb",
        email: "jbabb@wtamu.edu",
        studentId: 100100,
    });
    
    var s2 = new Student({
        username: 'APetrucionne',
        fname: "Anthony",
        lname: "Petruccione",
        email: "apetrucinne@wtamu.edu",
        studentId: 100100,
    });


    Student.create([s1, s2,], function(err, records) {

        var query = Student.find();
        query.exec(function(err, docs) {
            console.log("\n A list of students.");
            for (var i in docs) {
                console.log(JSON.stringify(docs[i].fname));
                console.log(JSON.stringify(docs[i].lname));
                console.log(JSON.stringify(docs[i].classification));
                console.log(JSON.stringify(docs[i].studentID));
                console.log();
            }
        });
        
    });
});