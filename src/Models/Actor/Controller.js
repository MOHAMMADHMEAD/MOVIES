import Actor from './Model'
import Boom from 'boom'
import {syncMovieElastic} from "../Movie/Controller"
import Movie from "../Movie/Model"
import mongoose from "mongoose";

export const fetchActor = async (request, response) => {
  try {
    let id = request.params.id;
    let result = await Actor
        .findOne({'_id': id})
        .exec()
    return(result)
  }
  catch (err) {
    return(Boom.badRequest( err.message))
  }
}

export const fetchActors = async (request, response) => {
  try {

    let actors = await Actor
        .find()
        .sort({ "createdAt": -1 })
        .exec()
    return(actors)
  } catch (err) {
    return(Boom.badRequest(err.message))
  }

}



export const postActor = async (request, response) => {

  try {
    let data = request.payload
    let actor = new Actor(data);


    await actor.save(async (err, doc) => {
      if (err) {
        return(Boom.badData( err.message));
      } else {
        return({
          status: 'success',
          actor: doc
        });
      }

    })
  }catch (err) {
    return(Boom.badData( err.message));

  }
}

export  const editActor = async (request, response) => {
  try {
    let data = request.payload;
    let result=await Actor.update({"_id": request.params.id}, {"$set": data})
    return({
      status: 'success',
      actor: result
    });
  }catch (err) {
    return(Boom.badData( err.message));
  }
}

export const removeActor=async (request, response) => {
  try {
    let id=request.params.id
    let documentIDs=await Movie.find({actors:{$in:[id.toString()]}}).distinct("_id")
    await Movie.updateMany({actors:{$in:[id.toString()]}} ,{ "$pull": { "actors":      id } },{ safe: true })
    let result = await Actor.remove({'_id': id})
    syncMovieElastic({ "_id":{$in:documentIDs}})
    return ("removed")
  }catch (err) {
    return(Boom.badData( err.message));
  }
}

