import mongoose from 'mongoose';
import Joi from "joi";

const ActorSchema = new mongoose.Schema({

    name: {type:String},
    facebook_likes: {type:Number,default:0},
    age:{type:Number,default:0},
    facebook_page_link:{type:String,default:null},


}, { timestamps: true, strict: true },);

ActorSchema.index({ name: "text" })


export const postActorSchema = Joi.object().keys({
    name:Joi.string().required(),
    facebook_likes:Joi.number(),
    age:Joi.number(),
    facebook_page_link:Joi.string().allow(null),

});

export const updateActorSchema = Joi.object().keys({
    name:Joi.string().required(),
    facebook_likes:Joi.number(),
    age:Joi.number(),
    facebook_page_link:Joi.string().allow(null),
});


export default mongoose.model('Actor', ActorSchema);
