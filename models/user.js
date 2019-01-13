var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var userSchema = mongoose.Schema({
    user_id:String,
	password:String,
	role:String,
    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
		img          : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
userSchema.statics.authenticate = function (email, password, callback) {
	User.findOne({user_id: email },function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
	  bcrypt.compare(password, user.password, function (err, result) {
		  console.log(password);console.log(user.password);
        if (result === true && user.role=="admin") {
          return callback(null, user);
        } else {
			var err = new Error('Invalid user.');
			err.status = 401;
			return callback(err)
        }
      })
    });
}
var User = mongoose.model('User', userSchema);
module.exports=User;

// create the model for users and expose it to our app
