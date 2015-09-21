var fs = require('fs')
var csv = require("csv-parse")

var parser = csv({ columns: true }, function(err, data){
  var rundles = data.reduce(function(mem, item){
    mem[item.Rundle] = mem[item.Rundle] || []
    mem[item.Rundle].push({
      qpct: item.QPct,
      ties: item.Ties
    })
    return mem
  }, {})

  var rundleRows = []
  for (var rundle in rundles) {
    var aggregatedRundleData = rundles[rundle].reduce(function(mem, player){
      mem.n += 1
      mem.qpct += parseFloat(player.qpct)
      mem.ties += parseFloat(player.ties)
      return mem
    }, { n: 0, qpct: 0, ties: 0 })

    rundleRows.push([
      rundle,
      aggregatedRundleData.qpct / aggregatedRundleData.n,
      aggregatedRundleData.ties / (aggregatedRundleData.n * 12.5)
    ].join(','))
  }

  process.stdout.write(rundleRows.join("\n") + "\n")
  
})

fs.createReadStream('data/LL65_Leaguewide_MD25.csv').pipe(parser);