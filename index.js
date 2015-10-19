var fs = require('fs')
var csv = require("csv-parse")
var u = require("underscore")

var parser = csv({ columns: true }, function(err, data){
  
  data = u.filter(data, function(i){
    return i.Rundle.substr(0,1) === "R"
  })

  data = u.sortBy(data, function(i){
    return parseInt(i.CAA * -1)
  })

  console.log(u.first(data, 10))
  
})

fs.createReadStream('data/LL66_Leaguewide_MD25.csv').pipe(parser);