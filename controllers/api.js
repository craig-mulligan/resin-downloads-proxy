var parseString = require('xml2js').parseString;
var request = require('request');
var _ = require('lodash');
var compare = require('compare-semver');

module.exports = function (req, callback) {
  request(process.env.URL + '?delimiter=/&prefix=' + req.params.product + '/', function (error, response, xml) {
    if (!error && response.statusCode == 200) {
      parseString(xml, function (err, result) {
          getVersions(result.ListBucketResult.CommonPrefixes, req.params.product, function(versions){
            console.log("versions: " + versions)
            callback(getLatestUrl(versions, req.params.product, req.params.os))
          })
      });
    }
  })
}

function getVersions(obj, product, callback) {
    callback(_.map(obj, function(v) {
      console.log(v.Prefix[0])
      return v.Prefix[0].substring(product.length + 1, v.Prefix[0].length - 1);
    }))
}

function getLatestUrl(versions, product, os) {
  var maxSemver = compare.max(versions);
  url = process.env.URL + "/" + product + "/" + maxSemver + "/" + product.capitalizeFirstLetter() + getExt(os)
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
    case "-x64.exe":
      return ".exe"
      break;
    case "linux":
      return "-linux-ia32.tar.gz"
      break;
    case "linux64":
      return "-linux-x64.tar.gz"
      break;
    default:
      return ".exe"
  }
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
