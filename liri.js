//Read and set any environment variables with the dotenv package
require("dotenv").config();

//import modules from npm packages first
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs"); //core node package to read and write files

//then import internal modules
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

//Take value and action arguments
var nodeArgs = process.argv; //store all args in an ARRAY
var value = nodeArgs[3]; //i.e. <maroon 5>, <forrest gump>
var action = nodeArgs[2]; //i.e. "concert-this", "movie-this"

//Switch-case statement will direct which function gets run.
  //if-else would also work
switch (action) {
  case "concert-this": 
    concertThis();
    break;

  case "spotify-this-song":
    spotifyThis();
    break;
  
  case "movie-this":
    movieThis();
    break;
  
  case "do-what-it-says":
    doThis();
    break;

  // no default
}

function concertThis() {
  var artist = value;
  for (var i = 3; i < nodeArgs.length; i++){
    if (i > 3 && i < nodeArgs.length) {
      artist = artist + "+" + nodeArgs[i];
    } else {
      artist = nodeArgs[i];
    } 
  }

  var bandsInTownURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  console.log(artist);
  console.log(bandsInTownURL);

  axios.get(bandsInTownURL).then(
    function (response) {
      console.log("\nName of venue: " + response.data[0].venue.name);
      console.log("Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region);
      console.log("Event date: " + moment(response.data[0].datetime).format("L")) //use moment to format date as MM/DD/YYYY
    }
  ).catch(
    function (error) {
      if (error.response) {
        console.log("Error response: ", error.response);
      } else {
        console.log("Error message: ", error.message);
      }
      console.log("Error config: ", error.config);
    }
  )
}

function spotifyThis() {
  var songName = value;
  if (value === undefined){ //if user doesn't type in a song
    songName = "The Sign Ace of Base";
  } 

  for (var i = 3; i < nodeArgs.length; i++){
    if (i > 3 && i < nodeArgs.length) {
      songName = songName + "+" + nodeArgs[i];
    } else {
      songName = nodeArgs[i];
    } 
  }
  
  //use node-spotify-api "search" method 
  spotify.search({ type: 'track', query: songName, limit: 1 })
  .then(function(response) {
    console.log("\nArtist: " + response.tracks.items[0].artists[0].name);
    console.log("Song name: " + response.tracks.items[0].name);
    console.log("Preview link: " + response.tracks.items[0].preview_url);
    console.log("Album: " + response.tracks.items[0].album.name);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function movieThis() {
  var movieName = value;
  if (value === undefined){ //if user doesn't type in a movie
    movieName = "Mr. Nobody";
  } 

  for (var i = 3; i < nodeArgs.length; i++){
    if (i > 3 && i < nodeArgs.length) {
      movieName = movieName + "+" + nodeArgs[i];
    } else {
      movieName = nodeArgs[i];
    } 
  }

  var omdbUrl = "https://www.omdbapi.com/?apikey=7328c6f&t=" + movieName + "&plot=short";
  console.log(omdbUrl);

  axios.get(omdbUrl).then(
    function(response) {
      console.log("\nTitle: " + response.data.Title);
      console.log("Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      console.log("Country: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
    }
  ).catch(
    function(error){
      console.log("Error: ", error.message);
    }
  )
}

function doThis() {
  fs.readFile("random.txt", "utf8", function(error,data) {
    if (error) {
      return console.log("Error: " + error);
    }

    console.log(data); //print the content of random.txt
    var dataArr = data.split(","); //split content by commas and re-display as an array
    console.log(dataArr);
  })
}

