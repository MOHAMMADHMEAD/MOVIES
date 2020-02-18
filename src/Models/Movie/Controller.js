import Movie from './Model'
import Actor from "../Actor/Model"
import Directors from "../Director/Model"
import Boom from 'boom'
import csv from 'csvtojson';
import _ from "lodash"
import mongoose from "mongoose";
var file = "./src/utils/movieData.csv"

export function syncMovieElastic(query={}) {
    var count = 0
    console.log(query)
    var stream = Movie.synchronize(query)
    stream.on('data', function (err, doc) {
        console.log(count)
        count++;
    });
    stream.on('close', function () {
        console.log('indexed ' + count + ' documents!');
    });
    stream.on('error', function (err) {
        console.log(err);
    });
}

export const fetchMovie = async (request, reply) => {
    try {
        let id = request.params.id;
        let result = await Movie
            .findOne({'_id': id})
            .exec()
        return (result)
    } catch (err) {
        return (Boom.badRequest(err.message))
    }
}

export const fetchMovies = async (request, reply) => {
    try {

        let movie = await Movie
            .find()
            .sort({"createdAt": -1})
            .exec()
        return (movie)
    } catch (err) {
        return (Boom.badRequest(err.message))
    }

}

export async function searchMovies(request, reply) {
    try {


        let data = await search(request.query.search)
        return (data)
    } catch (err) {
        return (Boom.badRequest(err.message))
    }

}

export async function filterMovies(request, reply) {
    try {

        console.log('request.query', request.query)

        let data = await filter(request.query ? request.query : null)
        return (data)
    } catch (err) {
        return (Boom.badRequest(err.message))
    }

}

async function search(term) {

    return new Promise((resolve, reject) => {
        console.log('ss', term)

        Movie.search({query_string: {query: term}}, async (err, results) => {
            console.log(results);
            if (err) reject(err)

            var data = []

            data = await results.hits.hits.map(function (hit) {
                return hit;
            });

            resolve({total: results.hits.total, data: data})
        });

    })
}

async function getCount() {
    try {

        return new Promise(async (resolve, reject) => {
            let processQuery = {
                "match_all": {}
            }
            let range = await geterateRange()
            Movie.esSearch({query: processQuery},
                {
                    aggs: {
                        "language": {
                            "terms": {"field": "language"}
                        },
                        "country": {
                            "terms": {"field": "country"}
                        },
                        "imdb_score": {
                            "range": {
                                "field": "imdb_score",
                                "ranges": range
                            }
                        }
                    }
                }
                , async (err, results) => {
                    console.log(results);
                    if (err) reject(err)

                    var data = []

                    data = await results.hits.hits.map(function (hit) {
                        return hit;
                    });

                    resolve({total: results.hits.total, data: results.aggregations})
                });

        })
    } catch (e) {
        return e
    }
}

async function filter(query) {
    try {
        let processQuery={}
        let q=[]
        if (Object.entries(query).length !== 0) {
            console.log(query)

            if (query.genres) {
                q.push({ "term":  { "genres":query.genres.toLowerCase() }})
            }

            if (query.plot_keywords) {
                q.push({ "term":  { "plot_keywords":query.plot_keywords.toLowerCase() }})
            }
            processQuery={
                "bool": {
                    "must": [
                        { "match_all": {}}
                    ],
                    "filter": q
                }

            }

        } else {
            processQuery = {
                "match_all": {}
            }
        }

        return new Promise(async (resolve, reject) => {
            console.log('sss', JSON.stringify(processQuery))

            Movie.esSearch({"query":processQuery}, async (err, results) => {
                console.log(results);
                if (err) reject(err)

                var data = []

                data = await results.hits.hits.map(function (hit) {
                    return hit;
                });

                resolve({total: results.hits.total, data: data})
            });

        })
    } catch (e) {
        return e
    }
}


export const postMovie = async (request, reply) => {

    try {
        let data = request.payload
        let movie = new Movie(data);
        await movie.save()
        await movie.on('es-indexed', function (err, res) {
            if (err) throw err;
            console.log("inserted data is indexed");
        });
        return ({
            status: 'success',
        });
    } catch (err) {
        return (Boom.badData(err.message));

    }
}
export const getMoviesAnalysis = async (request, reply) => {

    try {
        let data = await getCount()
        return (data)
    } catch (err) {
        return (Boom.badData(err.message));

    }
}


async function geterateRange() {
    try {
        let processQuery = {
            "match_all": {}
        }
        return await new Promise((resolve, reject) => {

            Movie.esSearch({query: processQuery},
                {
                    aggs: {
                        "max_imdb": {"max": {"field": "imdb_score"}},
                        "min_imdb": {"min": {"field": "imdb_score"}},

                    }
                }
                , async (err, results) => {
                    console.log('result', results);
                    if (err) reject(err)

                    var range = []

                    for (let i = parseInt(results.aggregations.min_imdb.value); i <= results.aggregations.max_imdb.value; i++) {

                        range.push({"from": i, "to": i + 1})
                    }
                    console.log('range', range)


                    resolve(range)
                });

        })
    } catch (e) {
        return e
    }


}




export async function generateData() {

    try {

        console.log("actors remove")
        await Actor.remove({})
        console.log("Directors remove")
        await Directors.remove({})
        console.log("Movie remove")
        await Movie.remove({})


// //import csv file
        const importData = await csv().fromFile(file);

// // add actors

        let actors = [], addActors = [], addDirectors = [], director = [], movies = [], actorsByName = [], directorsByName = []

        importData.map(row => {


            if (row.actor_1_name && !addActors.includes(row.actor_1_name)) {
                actors.push({
                    name: row.actor_1_name,
                    facebook_likes: parseInt(row.actor_1_facebook_likes),
                    age: 0,
                })
                addActors.push(row.actor_1_name)
            }
            if (row.actor_2_name && !addActors.includes(row.actor_2_name)) {
                actors.push({
                    name: row.actor_2_name,
                    facebook_likes: parseInt(row.actor_2_facebook_likes),
                    age: 0,
                })
                addActors.push(row.actor_2_name)

            }
            if (row.actor_3_name && !addActors.includes(row.actor_3_name)) {
                actors.push({
                    name: row.actor_3_name,
                    facebook_likes: parseInt(row.actor_1_facebook_likes),
                    age: 0,
                })
                addActors.push(row.actor_3_name)

            }
            if (row.director_name && !addDirectors.includes(row.director_name)) {
                director.push({
                    name: row.director_name,
                    facebook_likes: parseInt(row.director_facebook_likes),
                    age: 0,
                    username: row.director_name.replace(" ", "_"),
                    password: "12345678",
                })
                addDirectors.push(row.director_name)
            }

        })


        let actorsUser = await Actor.insertMany(actors)
        let direcotrsUser = await Directors.insertMany(director)

        actorsByName = _.keyBy(actorsUser, 'name')

        directorsByName = _.keyBy(direcotrsUser, 'name')

        for (let i = 0; i < importData.length; i++) {
            let row = importData[i]
            //   }
            // importData.map((row,index)=> {


            let movieActor = []
            if (row.actor_1_name && actorsByName[row.actor_1_name]) {
                movieActor.push(actorsByName[row.actor_1_name]._id.toString())
            }
            if (row.actor_2_name && actorsByName[row.actor_2_name]) {
                movieActor.push(actorsByName[row.actor_2_name]._id.toString())


            }
            if (row.actor_3_name && actorsByName[row.actor_3_name]) {
                movieActor.push(actorsByName[row.actor_3_name]._id.toString())
            }


            let movieObject = {
                title: row.movie_title,
                gross: row.gross ? parseInt(row.gross) : 0,
                genres: row.genres ? row.genres.split("|") : [],
                num_voted_users: row.num_voted_users ? parseInt(row.num_voted_users) : 0,
                cast_total_facebook_likes: row.cast_total_facebook_likes ? parseInt(row.cast_total_facebook_likes) : 0,
                plot_keywords: row.plot_keywords ? row.plot_keywords.split("|") : [],
                imdb_link: row.movie_imdb_link,
                language: row.language ? row.language : "",
                country: row.country ? row.country : null,
                content_rating: row.content_rating,
                budget: row.budget ? parseFloat(row.budget) : 0,
                title_year: row.title_year,
                imdb_score: row.imdb_score ? parseFloat(row.imdb_score) : 0,
                aspect_ratio: row.aspect_ratio ? parseFloat(row.aspect_ratio) : 0,
                movie_facebook_likes: row.movie_facebook_likes ? parseInt(row.movie_facebook_likes) : 0,
                director: directorsByName[row.director_name] ? directorsByName[row.director_name]._id : null,
                actors: movieActor,
                color: row.color
            }

            movies.push(movieObject)


        }


        let moviesResult = await Movie.insertMany(movies)

        syncMovieElastic()

        return ({
            status: 'success',
            message: `import finish added ${moviesResult.length} movies and ${direcotrsUser.length} directors and ${actorsUser.length} actors`,
        });


    } catch (err) {
        return (Boom.badRequest(err.message));

    }
}

export const editMovie = async (request, reply) => {
    try {
        let data = request.payload;
        let result = await Movie.update({"_id": request.params.id}, {"$set": data})
        return ({
            status: 'success',
            move: result
        });
    } catch (err) {
        return (Boom.badRequest(err.message));
    }
}

export const removeMovie = async (request, response) => {
    try {

        await Movie.findOne({_id: request.params.id}, async (err, doc) => {
            console.log('eeee')
            if (err) {
                return (Boom.badData(err.message));

            }
            await doc.remove()
            await doc.on('es-removed')

            await doc.remove()


            return ({status: "removed"})


        })
        return (Boom.badRequest("id not found"));


    } catch (err) {
        return (Boom.badRequest(err.message));
    }
}

