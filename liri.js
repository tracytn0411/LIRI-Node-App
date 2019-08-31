//Read and set any environment variables with the dotenv package
require("dotenv").config();

//import modules from npm packages first
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs"); //core node package to read and write files
var log4js = require("log4js"); //logging framework for node
var chalk = require("chalk"); //color and styles terminal

//then import internal modules
var keys = require("./keys.js");


//============Variables============//
var spotify = new Spotify(keys.spotify);
var logger = log4js.getLogger();
log4js.configure({ //write log events to a file (File Appender)
  appenders: { everything: { type: "file", filename: "log.txt" } },
  categories: { default: { appenders: ["everything"], level: "info" } }
})
var nodeArgs = process.argv; //store all args in an ARRAY
var value = nodeArgs[3]; //i.e. <maroon 5>, <forrest gump>
var action = nodeArgs[2]; //i.e. "concert-this", "movie-this"


//=============BANDSINTOWN==============//
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
  //console.log(artist);
  //console.log(bandsInTownURL);

  axios.get(bandsInTownURL)
    .then(function (response) {
      var data = response.data[0];
      var eventData = (
        "-------->BandsInTown<---------"
        + "\nName of venue: " + data.venue.name
        + "\nVenue location: " + data.venue.city + "," + data.venue.region
        + "\nArtist: " + artist
        + "\nEvent date: " + moment(data.datatime).format("L")) + "\n"
      
      console.log(eventData);
      logger.info(eventData); //write log events to log.txt
    })
    .catch(function (error) {
      if (error.response) {
        console.log("Error response: ", error.response);
      } else {
        console.log("Error message: ", error.message);
      }
      console.log("Error config: ", error.config);
    });
  }


//===================SPOTIFY==================//
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
      var data = response.tracks.items[0];

      var spotifyData = (
        "============Spotify============"
        + "\nArtist: " + data.artists[0].name
        + "\nSong name: " + data.name
        + "\nAlbum: " + data.album.name
        + "\nPreview link: " + data.preview_url + "\n"
      );
      console.log(spotifyData);
      logger.info(spotifyData); //log.txt
    })

    .catch(function(error) {
      if (error.response) {
        console.log("Error response: ", error.response);
      } else {
        console.log("Error message: ", error.message);
      }
      console.log("Error config: ", error.config);
    });
  }

//==================OMDB======================//
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
  console.log(chalk.blue(omdbUrl));

  axios.get(omdbUrl).then(
    function(response) {
      var omdb = response.data;

      var omdbData = (
        "============OMDB============"
        + "\nTitle: " + omdb.Title
        + "\nYear: " + omdb.Year
        + "\nIMDB Rating: " + omdb.Ratings[0].Value
        + "\nRotten Tomatoes Rating: " + omdb.Ratings[1].Value
        + "\nCountry: " + omdb.Country
        + "\nPlot: " + omdb.Plot
        + "\nActors: " + omdb.Actors + "\n"
      );
      console.log(omdbData);
      logger.info(omdbData); //log.txt
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
    //console.log(data); //print the content of random.txt
    var dataArr = data.split(","); //split content by commas and re-display as an array
    //console.log(dataArr);

    //set action and value to dataArray
    action = dataArr[0];
    value = dataArr[1];
  })
}

//====================SWITCH CASE STATEMENT=======================//
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
  
  default:
    console.log(chalk.red("Please give me a command."));
  }

