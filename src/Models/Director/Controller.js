import Director from './Model'
import Boom from 'boom'
import {syncMovieElastic} from "../Movie/Controller"
import Movie from "../Movie/Model"
import mongoose from "mongoose";

export const fetchDirector = async (request, reply) => {
  try {
    let id = request.params.id;
    let result = await Director
        .findOne({'_id': id})
        .exec()
    return(result)
  }
  catch (err) {
    return(Boom.badRequest( err.message))
  }
}

export const fetchDirectors = async (request, reply) => {
  try {

    let director = await Director
        .find()
        .sort({ "createdAt": -1 })
        .exec()
    return(director)
  } catch (err) {
    return(Boom.badRequest(err.message))
  }

}



export const postDirector = async (request, reply) => {

  try {
    let data = request.payload
    let director = new Director(data);


    await director.save(async (err, doc) => {
      if (err) {
        return(Boom.badData( err.message));
      } else {
        return({
          status: 'success',
          director: doc
        });
      }

    })
  }catch (err) {
    return(Boom.badData( err.message));

  }
}

export  const editDirector = async (request, reply) => {
  try {
    let data = request.payload;
    let result=await Director.update({"_id": request.params.id}, {"$set": data})
    return({
      status: 'success',
      move: result
    });
  }catch (err) {
    return(Boom.badData( err.message));
  }
}

export const removeDirector=async (request, reply) => {
  try {
    var id = mongoose.Types.ObjectId(request.params.id);

    await Movie.updateMany({director:id} ,{ "$set": { "director": null } },{ safe: true })
    let result = await Director.remove({'_id': id})
    syncMovieElastic({ "director":null})
    return ("removed")
  }catch (err) {
    return(Boom.badData( err.message));
  }
}



