# Movies

use Mongoose with Elastic search using [mongoosestatic](https://github.com/mongoosastic)


> **dont forget remove movies index from elastic search**

## Notes
The data is auto generated from csv file

## Installation

    git clone
    npm install 
    npm run dev

## EndPoints

Search Api

    metohd :get
    url:/api/movie/search?search=hmead2
    
    search using search params

 
Filter Api 

    metohd :get
    url:/api/movie/all?genres=Action&plot_keywords=blockbuster
    
    filter using generes,plot_keywords params

Count Api
	
	metohd :get
    url:/api/movie/count
    
    count country,language,imdb_score(range query)

Crud Moives

    method :get,post,delete,put
    url:/api/v1/movies/:id
    add id in put or delete api

Crud Actors

    method :get,post,delete,put
    url:/api/v1/actors/:id
    add id in put or delete api
Crud Directors

    method :get,post,delete,put
    url:/api/v1/directors/:id
    add id in put or delete api    


