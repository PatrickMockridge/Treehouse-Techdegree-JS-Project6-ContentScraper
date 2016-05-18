'use strict';
//if (!filesystemobject.FolderExists("data")) {
//filesystemobject.CreateFolder("data");
//}

var request = require("request");
var cheerio = require("cheerio");
var json2csv = require('json2csv');
var fs = require('fs');
var $ = require("jquery");

var  url = "http://shirts4mike.com";
var shirtsUrls = [];
request(url, function (error, response, body) {
  if (!error) {
    var $ = cheerio.load(body)      ;
    $(".products > li > a").each(function (index) {
      shirtsUrls.push($(this).attr("href"))
    }
    );
  }
  else {
    console.log("We’ve encountered an error: " + error);
  }
  console.log(shirtsUrls);
  return shirtsUrls;
});
var allShirts = new Array();
var fields = ['Title', 'Price', 'URL', 'Time'];
console.log(url+"/"+shirtsUrls[1])
setTimeout(function(){for ( var i = 0; i < shirtsUrls.length; i++) {
    var localShirtsUrl = (url+"/"+ shirtsUrls[i]);
    request(localShirtsUrl, function (error, response, body) {
      if (!error) {
        var $ = cheerio.load(body)      ;
     var title = $('body').find(".shirt-details > h1").text();
     var price = $('body').find(".price").text();
     var imageUrl = $('.shirt-picture').find("img").attr("src");
     var dateTime = new Date();
     var shirtObject = {}
     shirtObject.Title = title;
     shirtObject.Price = price;
     shirtObject.ImageURL = imageUrl;
     shirtObject.url = localShirtsUrl;
     shirtObject.Time = dateTime;
     allShirts.push(shirtObject);
     console.log(allShirts);
     console.log(shirtObject);
     return allShirts;
   }
 else {
   console.log("We’ve encountered an error: " + error);
 }
});
}}, 5000);
console.log(allShirts);
setTimeout(function() { json2csv({ data: allShirts, fields: fields }, function(err, csv) {
  if (err) console.log(err);
  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
});
}, 5000);
