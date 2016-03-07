var jsdom = require('jsdom');
var $ = require('jquery')(jsdom.jsdom().defaultView);
var compare = require('compare-semver');
/*!
 * Module dependencies.
 */

var request = require('request');

module.exports = function (req, callback) {
  request(process.env.URL + '?delimiter=/&prefix=' + req.params.product + '/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      getVersions($(body), req.params.product, function(versions){
        callback(getLatestUrl(versions, req.params.product, req.params.os))
      });
    }
  })
};

function getVersions(xml, product, callback){
  var versions = []
  var directories = $.map(xml.find('CommonPrefixes'), function(item) {
    item = $(item);
    var path = item.find('Prefix').text()
    var path = path.substring(product.length + 1, path.length - 1)
    versions.push(path);
  });
  callback(versions)
}

function getLatestUrl(versions, product, os) {
  var maxSemver = compare.max(versions);
  url = process.env.URL + "/" + product + "/" + maxSemver + "/" + product + getExt(os)
  return url
}

function getExt(os) {
  switch (os) {
    case "osx":
      return ".dmg"
      break;
    case "windows":
      return ".exe"
      break;
    default:
      console.log("Sorry, nothing matches " + os);
  }
}
