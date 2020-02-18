import {editActor, fetchActor, fetchActors, postActor, removeActor} from "./Controller";
import { PostActorJoiSchema, UpdateActorJoiSchema} from './Model'

export default [

  {
    method: 'GET',
    path: '/api/v1/actors',
    handler: fetchActors
  },

  {
    method: 'GET',
    path: '/api/v1/actors/{id}',
    handler: fetchActor
  },

  {
    method: 'POST',
    path: '/api/v1/actors',
    handler: postActor,
    config: {
      validate: {
        payload: PostActorJoiSchema
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/v1/actors/{id}',
    handler: editActor,
    config: {
      validate: {
        payload: UpdateActorJoiSchema
      },
    }
  },
  {
    method: 'DELETE',
    path: '/api/v1/actors/{id}',
    handler: removeActor
  },

]
