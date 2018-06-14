var dotenv = require("dotenv").config();

var fs = require("fs");

var request = require("request");

var keys = require("./keys");

var Twitter = require('twitter');

var client = new Twitter(keys.twitter);

var Spotify = require('node-spotify-api')

var spotify = new Spotify(keys.spotify);

// Store all of the arguments in an array
var nodeArgs = process.argv;

// variable to hold the movie and song names
var movieName = "";
var songName = "";

//my-tweets will run if condition is met:
if (nodeArgs[2] == "my-tweets"){
    //set screen name to my name
    var params = {screen_name: 'h_blix'};

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i++){
                console.log("'" + tweets[i].text + "' \n(tweeted at " + tweets[i].created_at + ")");
                }
            }
        else{
            console.log(error);
            }
    });
};

//movie-this will run if condition is met:
if (nodeArgs[2] == "movie-this") {

    //if user doesn't enter movie name, set movieName to Mr. Nobody
    if (nodeArgs.length == 3){
        movieName = "mr+nobody";
    }

    else{
// Loop through all the words in the node argument and include "+"s between the appropriate arguments
        for (i = 3; i < nodeArgs.length; i++) {

             if (i > 3 && i < nodeArgs.length) {

                     movieName = movieName + "+" + nodeArgs[i];

                    }

            else {
                 movieName += nodeArgs[i];
                    }
            }
    }
// run a request to the OMDB API with the chosen movie
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";


request(queryUrl, function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {

    //console.log the appropriate information
    console.log("Title: " +JSON.parse(body).Title + "\nReleased: " + JSON.parse(body).Year + 
                "\nimdb Rating: " + JSON.parse(body).imdbRating + "\nRotten Tomato Rating: " + JSON.parse(body).tomatoRating + 
                "\nCountry of Origin: " + JSON.parse(body).Country + "\nLanguage(s): " + JSON.parse(body).Language + 
                "\nPlot: " +JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors)
                    }
            });
};


//spotify-this-song will run if condition is met:
if (nodeArgs[2] == "spotify-this-song") {

    //if user doesn't enter movie name, set songName to "all that she wants" cause i like that song 
    //better than "the sign" (and some weird song kept displaying when i set the default to "the sign")
    if (nodeArgs.length == 3){
        songName = "all+that+she+wants";
            }

    else{
// Loop through all the words in the node argument and include "+"s between the appropriate arguments
            for (i = 3; i < nodeArgs.length; i++) {

                if (i > 3 && i < nodeArgs.length) {
                        songName = songName + "+" + nodeArgs[i];
                    }

                else {
                        songName += nodeArgs[i];
                    }
                }
        }   

    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        //display relevant data to console
        console.log("Artist: " + data.tracks.items[0].artists[0].name + 
        "\nSong Name: " + data.tracks.items[0].name + "\nPreview URL: " + data.tracks.items[0].preview_url + 
        "\nAlbum: " + data.tracks.items[0].album.name + " (" + data.tracks.items[0].album.release_date + ")");
        
      });
    

};

if (nodeArgs[2] == "do-what-it-says") {
    //set appropriate filename
    filename = "./random.txt";
    //read random.txt, split the file into an array, replacing unnecessary quotation marks from the song title element. display errors if any occur.
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        songNameWspace = data.split(',')[1].replace('"', '').replace('"', '');
        //split the song title into an array, removing the spaces
        songNameArr = songNameWspace.split(' ');
        //set the first element of this array as the initial songName
        songName = songNameArr[0];
        //add subsequent elements separated by '+'
        if (songNameArr.length > 1) {  
            for (i = 1; i < songNameArr.length; i++){
                songName = songName + "+" + songNameArr[i];
                }
            }
        //save the initial element of the first array as a variable if needed in the future
        corrFunction = data.split(',')[0];
        
       

        spotify.search({ type: 'track', query: songName }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            //display relevant data to console
            console.log("Artist: " + data.tracks.items[0].artists[0].name + 
            "\nSong Name: " + data.tracks.items[0].name + "\nPreview URL: " + data.tracks.items[0].preview_url + 
            "\nAlbum: " + data.tracks.items[0].album.name + " (" + data.tracks.items[0].album.release_date + ")");
            
          });
        });           
};

