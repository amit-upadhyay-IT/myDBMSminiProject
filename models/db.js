// One important thing in this application is that like DAO design pattern we are trying to keep all data access code in one single file.

// mongodb is very flexible we don't even need to think that if on the database the collection exists or not.

// There is a library 'mongoose' in node.js which is used to access mongodb in node.js

var chalk = require('chalk');
var mongoose = require( 'mongoose' );
var bcrypt=require('bcrypt');
var SALT_WORK_FACTOR = 10;


//var dbURI = 'mongodb://127.0.0.1/test';


var dbURI = 'mongodb://amitupadhyaydb:amit1234@ds053156.mlab.com:53156/mystudyportal';


mongoose.connect(dbURI);

// when the collection will be established the below evens will be raised.
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
// upto this point nothing gets done, this schema is not related to the collecion on database.


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

// here in model we are providing two arguments and we are now going to create a model on the basis of the schema,
mongoose.model( 'User', userSchema );
// when we say mongoose.model then at that time we are compiling our schema now some kind of logical collection will be created
// and that logical table will be known as a model and the name of that model is 'User'
// Again we are simply mapping all the data inside userSchema to the 'User' collection. The name of the model(collection) is 'User'


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
