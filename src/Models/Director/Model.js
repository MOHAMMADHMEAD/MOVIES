import mongoose from 'mongoose';
import Joi from "joi";

const ActorSchema = new mongoose.Schema({

    name: {type:String},
    facebook_likes: {type:Number,default:0},
    age:{type:Number},
    username:{type:String},
    password:{type:String},


}, { timestamps: true, strict: true },);

ActorSchema.index({ name: "text" })


export const PostDirectorJoiSchema = Joi.object().keys({
    name:Joi.string().required(),
    facebook_likes:Joi.number(),
    age:Joi.number().required(),
    username:Joi.string().required(),
    password:Joi.string().required(),

});

export const UpdateDirectorJoiSchema = Joi.object().keys({
    name:Joi.string().required(),
    facebook_likes:Joi.number(),
    age:Joi.number().required(),
    username:Joi.string().required(),
    password:Joi.string().required(),
});


export default mongoose.model('Director', ActorSchema);
