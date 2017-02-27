var crypto = require('crypto');
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/mydoc');
var mongoose = require('./mongooseConnect');

var userSchema = new mongoose.Schema({
    password: String,
    email: String,
    phone: String
}, {
        collection: 'users'
    });
var userModel = mongoose.model('User', userSchema);
function User(user)
{
    this.password = user.password;
    this.email = user.email;
    this.phone = user.phone;
};
User.prototype.save = function (callback)
{
    var md5 = crypto.createHash('md5');
    var password = md5.update(this.password.toLowerCase()).digest('hex');
    var user = {
        password: password,
        email: this.email,
        phone: this.phone
    };
    var newUser = new userModel(user);
    newUser.save(function (err, user)
    {
        if (err)
        {
            return callback(err);
        }
        callback(null, user);
    });  

};
User.get = function (user, callback)
{
    if (user.email == "")
    {
        userModel.findOne({ phone: user.phone }, function (err, user)
        {
            if (err)
            {
                return callback(err);
            }
            callback(null, user);
        });
    } else
    {
        userModel.findOne({ email: user.email }, function (err, user)
        {
            if (err)
            {
                return callback(err);
            }
            callback(null, user);
        });
    }

};
module.exports = User;