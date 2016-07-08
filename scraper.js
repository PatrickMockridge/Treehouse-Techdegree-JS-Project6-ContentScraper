'use strict';

/**
  * momentjs is a convenience library for managing dates and times
  * added following comments that my date/time would be better if in an easier to read format
*/
var moment = require('moment');
/**
  * require necessary npm packages
  * request as an easy way to make http calls
*/
var request = require("request");
/**
  * cheerio for navigating the DOM
  * I decided to use Cheerio as a scraping tool because it allowed me to traverse the DOM in JQuery.
  * Cheerio thus made it much easier to code a solution using a standard library that I am already familiar with
  * The formatting of the cheerio object also makes it simple to implement
*/
var cheerio = require("cheerio");
/**
  * json 2 csv for converting the scraped data into a CSV file. JSON created natively.
  * I decided to use this package because of how straightforward and easy it was to grasp how to readily
  * I was able to convert a Javascript syntax into the required CSV file.
  * json2csv is also well supported and widely used
 */
var json2csv = require('json2csv');
/**
 * fs for creating folders and files
 */
var fs = require('fs');
/**
 * function for handling errors
 * @constructor
 * @param {object} error - An error object getting thrown
*/
var errorHandler = function (error) {
console.log(error.message);
console.log('The scraper could not not scrape data from ' + url + ' there is either a problem with your internet connection or the site may be down');
/**
 * create new date for log file
 */
var loggerDate = new Date();
/**
 * create message as a variable
*/
var errLog = '[' + loggerDate + '] ' + error.message + '\n';
/**
 * when the error occurs, log that to the error logger file
 */
fs.appendFile('scraper-error.log', errLog, function (err) {
  if (err) throw err;
  console.log('There was an error. The error was logged to scraper-error.log');
});
};
/**
 * my favourite website of all time
*/
var  url = "http://shirts4mike.com/";

var allShirts = new Array();
/**
  * CSV header
*/
var fields = ['Title', 'Price', 'ImageURL', 'url', 'Time'];
request(url, function (error, response, body) {
  if (!error) {
    /**
     * use cheerio to traverse DOM
    */
    var $ = cheerio.load(body);
    /**
     * find the path to the page with the shirts on it
    */
    var shirtsPath = $(".shirts > a").attr("href");
    var shirtsUrl = url + shirtsPath
      request(shirtsUrl, function (error, response, body) {
      if(!error) {
        /**
         * use cheerio to traverse DOM
        */
        var $ = cheerio.load(body);
    /**
      * total number of shirts on the page
    */
    var finished = $(".products > li > a").length;
    $(".products > li > a").each(function (index) {
      var localShirtsUrl = ("http://shirts4mike.com/"+ $(this).attr("href"));
      /**
        * make http request
      */
      request(localShirtsUrl, function (error, response, body) {
        if (!error) {
          /**
            * load into cheero to enable DOM traversal
          */
          var $ = cheerio.load(body);
          /**
            * traverse the DOM to get the necessary info
          */
       var title = $('body').find(".shirt-details > h1").text().slice(4); // slice to remove the price form the title
       var price = $('body').find(".price").text();
       var imageUrl = $('.shirt-picture').find("img").attr("src");
       /**
         * create JSON object for each shirt
         & @param shirtObject {object} - formatting the details of the shirt into JSON to allow for conversion to CSV
       */
       var shirtObject = {}
       shirtObject.Title = title;
       shirtObject.Price = price;
       shirtObject.ImageURL = imageUrl;
       shirtObject.url = localShirtsUrl;
       shirtObject.Time = moment().format('MMMM Do YYYY, h:mm:ss a');
       allShirts.push(shirtObject);
       if (allShirts.length == finished) {
         /**
         * get today's date courtesy of moment.js
         */
         var toDay = moment().format('YYYY[-]MM[-]DD')
          /**
            * make a new data folder if one doesn't already exist
          */
          var dir = './data';
          if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
          }
          /**
            * turn the shirts JSON file into a shirts CSV file with today's date as a file name.
          */
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
       errorHandler(error);
    }});
    });
  }
   else {
     errorHandler(error);
   }
 });
}
  else {
    errorHandler(error);
  }});
