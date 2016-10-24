// There is a library 'mongoose' in node.js which is used to access mongodb in node.js

var chalk = require('chalk');
var mongoose = require( 'mongoose' );
var bcrypt=require('bcrypt');
var SALT_WORK_FACTOR = 10;


//var dbURI = 'mongodb://127.0.0.1/test';


var dbURI = 'mongodb://amitupadhyaydb:amit1234@ds053156.mlab.com:53156/mystudyportal';


mongoose.connect(dbURI);


mongoose.connection.on('connected', function () {
  console.log(chalk.yellow('Mongoose connected to ' + dbURI));
});

mongoose.connection.on('error',function (err) {
  console.log(chalk.red('Mongoose connection error: ' + err));
});

mongoose.connection.on('disconnected', function () {
  console.log(chalk.red('Mongoose disconnected'));
});


// while using Mongoose we can create schema for proper management of database, the schema is the blueprint of
// how database is constructed.

// The feature of mongoose is that it allows us to store data in fixed schema format.

// In RDBMS we specify the structure of table while using create structure, similarly in this schema we are not actually creating
// any collection rather we are just defining a logical structure which will be applied agains our collection.
var userSchema = new mongoose.Schema({
  username: {type: String, unique:true},
  email: {type: String, unique:true},
  password: String
});


userSchema.pre('save', function(next) {
    var user = this;
    console.log("Before Registering the user");
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        console.log("Salt");
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            console.log("Hash : "+hash);
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};



// Build the User model
mongoose.model( 'User', userSchema );

// Stories Schema

var storiesSchema = new mongoose.Schema({
  author:String,
  title: {type: String,unique:true},
  created_at:{type:Date,default:Date.now},
  summary:String,
  content: {type: String},
  imageLink:String,
  comments:[{body:String,commented_by:String,date:Date}],
  slug:String
});

// Build the User model

mongoose.model( 'Story', storiesSchema,'stories');
