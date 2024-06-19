const bcrypt = require('bcryptjs');
const errorHandler = require('../utils/error')
const User = require('../models/user.model');
const test = (req, res) => {
    res.json({message: 'Api is working'})
}

const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.userId){
        console.log(1)
        return next(errorHandler(403,'You are not allowed to update this user'));
    }
    if(req.body.password){
        if(req.body.password.length < 6){
            return next(errorHandler(400,'Password must atleast be 6 characters'));
        }
        req.body.password = await bcrypt.hash(req.body.password,10);      
    }

    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20){
            return next(errorHandler(400,'Username must be between 7 and 20 characters'));
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400,'Username must not contain any spaces'));
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400,'Username must be lower case'));
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400,'Username can only contain letters and numbers'));
        }
        
    }

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.userId,{
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            },
        },
        {new: true});

        const {password, ...rest} = updateUser._doc;
        res.status(200).json(rest);
        
    } catch(error){
        ///
    }
}

const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403,"You are not allowed to delete this user"));
    }

    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User has been deleted");
    } catch(error) {
        next(error);
    }
}


const signOut = (req, res, next) => {
    try{
        res.clearCookie('access_token').status(200).json("User has signout out");

    } catch(error) {
        next(error);
    }
}


module.exports.signOut = signOut;
module.exports.test = test;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;