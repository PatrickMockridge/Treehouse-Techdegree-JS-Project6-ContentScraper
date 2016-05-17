'use strict';
//if (!filesystemobject.FolderExists("data")) {
//filesystemobject.CreateFolder("data");
//}

var request = require("request");
var cheerio = require("cheerio");
var  url = "http://shirts4mike.com";
var shirtsUrls = [];
request(url, function (error, response, body) {
  if (!error) {
    var $ = cheerio.load(body)      ;
    $(".products > li > a").each(function (index) {
      shirtsUrls.push($(this).attr("href"))
    }
    );
    console.log(shirtsUrls);
  } else {
    console.log("We’ve encountered an error: " + error);
  }
});


// var scrape2csv = require('scrape2csv');
// //create variable so that header is only displayed once
// //var count =0;
// $.each(shirtsUrls, function(index) {
//   var localShirtsUrl = (url+$(this)[index]);
// //each article of the page will go through this
// var handler = function($, elem, index){
// 	var title = $(elem).find(".shirt-details > h1").text();
//   var price = $(elem).find(".price").text();
//   var imageUrl = $(elem).find(".shirt-picture > span > img").attr("src");
//   var dateTime = new Date();
// 	//returning a new row for the csv
// 	return [title, price, imageURL,localShirtsUrl, dateTime];
// //if (count == 0) {
// var header = ["Title", "Price", "ImageURL", "URL", "Time"];
// //count++;
// //return count;
// //}
// //else {
//   //var header = null;
// //}
// scrape2csv.scrape("data/data.csv", localShirtsUrl, jquery_selector, handler, header);
//
// }
// });
