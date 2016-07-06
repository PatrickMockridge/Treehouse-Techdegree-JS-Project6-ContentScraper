'use strict';
// require necessary npm packages
// request as an easy way to make http calls
var request = require("request");
// cheerio for navigating the DOM
// I decided to use Cheerio as a scraping tool because it allowed me to traverse the DOM in JQuery.
// Cheerio thus made it much easier to code a solution.
var cheerio = require("cheerio");
// json 2 csv for converting the scraped data into a CSV file. JSON created natively.
// I decided to use this package because of how straightforward and easy it was to grasp how to readily
// I was able to convert a Javascript syntax into the required CSV file.
// json2csv is also well supported and widely used
var json2csv = require('json2csv');
//fs for creating folders and files
var fs = require('fs');
//jquery for jquery
var $ = require("jquery");
// my favourite website of all time
var  url = "http://shirts4mike.com";
//create array in which to push shirts urls
var shirtsUrls = [];
//make http request
var allShirts = new Array();
var fields = ['Title', 'Price', 'ImageURL', 'url', 'Time']; //CSV header
request(url, function (error, response, body) {
  if (!error) {
    // use cheerio to traverse DOM
    var $ = cheerio.load(body);
    // total number of shirts on the page
    var finished = $(".products > li > a").length;
    $(".products > li > a").each(function (index) {
      var localShirtsUrl = (url+"/"+ $(this).attr("href"));
      //make http request
      request(localShirtsUrl, function (error, response, body) {
        if (!error) {
          //load into cheero to enable DOM traversal
          var $ = cheerio.load(body);
          //traverse the DOM to get the necessary info
       var title = $('body').find(".shirt-details > h1").text();
       var price = $('body').find(".price").text();
       var imageUrl = $('.shirt-picture').find("img").attr("src");
       var dateTime = new Date();
       //create JSON object for each shirt
       var shirtObject = {}
       shirtObject.Title = title;
       shirtObject.Price = price;
       shirtObject.ImageURL = imageUrl;
       shirtObject.url = localShirtsUrl;
       shirtObject.Time = dateTime;
       allShirts.push(shirtObject);
       if (allShirts.length == finished) {
         //get today's date courtesy of http://stackoverflow.com/questions/12409299/how-to-get-current-formatted-date-dd-mm-yyyy-in-javascript-and-append-it-to-an-i
         var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!
          var yyyy = today.getFullYear();
          if(dd<10){
              dd='0'+dd;
          }
          if(mm<10){
              mm='0'+mm;
          }
          var toDay = yyyy+'-'+mm+'-'+dd;
          //make a new data folder if one doesn't already exist
          var dir = './data';
          if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
          }
          //turn the shirts JSON file into a shirts CSV file with today's date as a file name.

         json2csv({ data: allShirts, fields: fields }, function(err, csv) {
         if (err) console.log(err);
         fs.writeFile( dir + "/" + toDay + '.csv', csv, function(err) {
           if (err) throw err;
           console.log('file saved');
         });
       });
       }
       return allShirts;
     }
   else {
     console.log(error.message);
     console.log('The scraper could not not scrape data from' + url + 'there is either a problem with your internet connection or the site may be down');
   }
  });
    }
    );
  }
  else {
    console.log(error.message);
    console.log('The scraper could not not scrape data from' + url + 'there is either a problem with your internet connection or the site may be down');
    }
});
