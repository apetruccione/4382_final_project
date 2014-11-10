var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var StudentSchema = new Schema({
    username: { type: String, unique: true },
    fname: String,
    lname: String,
    email: {type:String, unique: true},
    studentId: {type:Number, unique: true},
    hashed_password: String
});
mongoose.model('Student', StudentSchema);
