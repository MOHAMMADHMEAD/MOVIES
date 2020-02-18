import {editMovie, fetchMovie, fetchMovies, postMovie, removeMovie,searchMovies,generateData,getMoviesAnalysis,filterMovies} from "./Controller";
import { PostMovieJoiSchema, UpdateMovieJoiSchema} from './Model'

export default [

    {
        method: 'GET',
        path: '/api/v1/movies',
        handler: fetchMovies
    },

    {
        method: 'GET',
        path: '/api/v1/movies/{id}',
        handler: fetchMovie
    },
    {
        method: 'GET',
        path: '/api/movie/search',
        handler: searchMovies
    },
    {
        method: 'GET',
        path: '/api/movie/count',
        handler: getMoviesAnalysis
    },
    {
        method: 'GET',
        path: '/api/movie/all',
        handler: filterMovies
    },
    {
        method: 'POST',
        path: '/api/v1/movies/bulk',
        handler: generateData,
    },

    {
        method: 'POST',
        path: '/api/v1/movies',
        handler: postMovie,
    },
    {
        method: 'PUT',
        path: '/api/v1/movies/{id}',
        handler: editMovie,
        config: {
            validate: {
                payload: UpdateMovieJoiSchema
            },
        }
    },
    {
        method: 'DELETE',
        path: '/api/v1/movies/{id}',
        handler: removeMovie
    },

]
