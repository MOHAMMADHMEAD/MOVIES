import mongoose from "mongoose";
import Joi from "joi";
import mongoosastic from 'mongoosastic';
import config from "../../config"
const MovieSchema = new mongoose.Schema(
  {
      title: {type:String,default:null},
      gross: {type:Number,default:0,es_type:'long'},
      genres:{type:Array,default:[], es_type:'string'},
      num_voted_users:{type:Number,default:0,es_type:'long'},
      cast_total_facebook_likes:{type:Number,default:0,es_type:'integer'},
      plot_keywords:{type:Array,default:[] ,es_type:'string'},
      imdb_link:{type:String,default:null,es_type:'string'},
      language:{type:String,default:"",es_type:'string',es_fielddata: true},
      country:{type:String,default:null,es_type:'string',es_fielddata: true},
      content_rating:{type:String,default:null,es_type:'string'},
      budget:{type:Number,default:0,es_type:'long'},
      title_year:{type:String,default:null,es_type:'string'},
      imdb_score:{type:Number,default:0,es_type:'float'},
      aspect_ratio:{type:Number,default:0,es_type:'float'},
      movie_facebook_likes:{type:Number,default:0,es_type:'long'},
      director:{ default: null, type: mongoose.Schema.Types.ObjectId, ref: 'director',es_fielddata: true},
      actors: [{ default: null, type: mongoose.Schema.Types.ObjectId, ref: 'actor' }],
      color:{type:String,es_type:'string'},
  },
  { timestamps: true, strict: true }
);

MovieSchema.statics.esCount = function esCount(inQuery, inCb) {
    var cb = inCb,
        query = inQuery,
        esQuery;

    setIndexNameIfUnset(this.modelName);

    if (!cb && typeof query === 'function') {
        cb = query;
        query = null;
    }

    esQuery = {
        body: {
            query: query
        },
        index: indexName,
        type: typeName
    };

    esClient.count(esQuery, cb);
};


MovieSchema.plugin(mongoosastic,{
    hosts:[config.elasticUrl]
}) ;


export const PostMovieJoiSchema = Joi.object().keys({

    title: Joi.string().required(),
    gross: Joi.number(),
    genres: Joi.array(),
    plot_keywords: Joi.array(),
    num_voted_users: Joi.number(),
    cast_total_facebook_likes: Joi.number(),
    language: Joi.string(),
    country: Joi.string(),
    content_rating: Joi.string().allow(null),
    budget: Joi.number(),
    title_year: Joi.string().allow(null),
    imdb_score: Joi.number(),
    aspect_ratio: Joi.number(),
    movie_facebook_likes: Joi.number(),
    director:Joi.string().required(),
    actors:Joi.array().min(1).required(),
    color:Joi.string().required(),
});

export const UpdateMovieJoiSchema = Joi.object().keys({
    title: Joi.string().required(),
    gross: Joi.number(),
    genres: Joi.array(),
    plot_keywords: Joi.array(),
    num_voted_users: Joi.number(),
    cast_total_facebook_likes: Joi.number(),
    language: Joi.string(),
    country: Joi.string(),
    content_rating: Joi.string().allow(null),
    budget: Joi.number(),
    title_year: Joi.string().allow(null),
    imdb_score: Joi.number(),
    aspect_ratio: Joi.number(),
    movie_facebook_likes: Joi.number(),
    director:Joi.string().required(),
    actors:Joi.array().min(1).required(),
    color:Joi.string().required(),
});


let Movie = mongoose.model('Movie', MovieSchema);

Movie.createMapping(function(err, mapping){
    if(err){
        console.log('error creating mapping (you can safely ignore this)');
        console.log(err);
    }else{

        Movie.esTruncate((err)=>{
            console.log(err)

            console.log('dd')
        });
        console.log('mapping created!');
        console.log(mapping);
    }
});



export default Movie;

