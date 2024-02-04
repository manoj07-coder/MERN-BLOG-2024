import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/errorHandler.js';
import jwt from 'jsonwebtoken'

export const signUp = async(req,res,next)=>{
    const {username,email,password}=  req.body;

    if(!username || !email || !password || username === ''
    || email === '' || password === ''){
        return next(errorHandler(400,'All fields are required'))
    }

    const hashedPassword = bcryptjs.hashSync(password,10)

    const newUser = new User({username,email,password:hashedPassword});

    try {
        await newUser.save()
        res.status(200).json({msg:'user created successfully'})
    } catch (error) {
       return next(errorHandler(500,error.message))
    }
}


export const signIn = async (req,res,next)=>{
    const {email, password} = req.body;
    if(!email || !password || email === ''|| password === ''){
        return next(errorHandler(400,'All fields are required'))
    }
   try {
    const validUser = await User.findOne({email});
    if(!validUser){
        return next(errorHandler(404,'User not found'))
    }

    const validPassword = bcryptjs.compareSync(password,validUser.password)
    if(!validPassword){
        return next(errorHandler(400,'Wrong credentials'))
    }

    const token = jwt.sign({id:validUser._id,isAdmin:validUser.isAdmin},process.env.JWT_SECRET);

    const {password:pass, ...rest} = validUser._doc;

    res.status(200).cookie('access_token',token,{httpOnly:true})
    .json(rest)
   } catch (error) {
    return next(error)
   }
}

export const google = async(req,res,next)=>{
    const {name,email,photoURL} = req.body;
    try {
        const user = await User.findOne({email});
        if(user){
            const token = jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SECRET);
            const {password:pass,...rest} = user._doc;
            res.status(200).cookie('access_token',token,{httpOnly:true}).json(rest)
        }else{
            const password = Math.random().toString(36).slice(-8) + 
            Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(password,10);
            
            const newUser = new User({
                username:name.split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password:hashedPassword,
                profilePicture:photoURL
            });
            await newUser.save();
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password:pass,...rest} = newUser._doc;
            res.status(200).cookie('access_token',token,{httpOnly:true}).json(rest);
        }
    } catch (error) {
        console.log(error);
    }
}