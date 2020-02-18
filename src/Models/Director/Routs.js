import {editDirector, fetchDirector, fetchDirectors, postDirector, removeDirector} from "./Controller";
import { PostDirectorJoiSchema, UpdateDirectorJoiSchema} from './Model'

export default [

  {
    method: 'GET',
    path: '/api/v1/directors',
    handler: fetchDirectors
  },

  {
    method: 'GET',
    path: '/api/v1/directors/{id}',
    handler: fetchDirector
  },

  {
    method: 'POST',
    path: '/api/v1/directors',
    handler: postDirector,
    config: {
      validate: {
        payload: PostDirectorJoiSchema
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/v1/directors/{id}',
    handler: editDirector,
    config: {
      validate: {
        payload: UpdateDirectorJoiSchema
      },
    }
  },
  {
    method: 'DELETE',
    path: '/api/v1/directors/{id}',
    handler: removeDirector
  },

]
