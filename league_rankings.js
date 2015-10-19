var fs = require('fs')
var csv = require("csv-parse")
var u = require("underscore")

var parser = csv({ columns: true }, function(err, data){

  var byLeague = u.groupBy(data, function(player){

    switch (player.Branch) {
      case "DouganB":
      case "KleinmanA":
      case "McClaryT":
      case "McDougallJV":
      case "MintzR":
      case "MudrakJ":
      case "PenroseB":
      case "PierceE":
      case "SchwartzT":
      case "SimpsonF":
      case "SowersJ":
      case "Wolov":
        return "Continental"
      
      case "Alvord":
      case "ForesterW":
      case "GazzolaT":
      case "HalpinM":
      case "KaleV":
      case "LeglerD":
      case "MarcusJ2":
      case "PeskinK":
      case "Rebassoo":
      case "SanderD":
      case "ScheelerD":
      case "ShoreyM":
      case "TerpstraR":
      case "WolfeJ":
        return "Badlands"
      
      default:
        return player.League
    }

  })

  var qpctByLeague = u.map(byLeague, function(value, key){
    return {
      league: key,
      qpct: u.reduce(value, function(mem, player){
        return mem + parseFloat(player.QPct)
      }, 0) / value.length
    }
  })
  
  var sorted = u.sortBy(u.first(qpctByLeague, 19), function(lg){
    return lg.qpct * -1
  })

  var basis = u.reduce(sorted, function(mem, lg){
    return mem + lg.qpct
  }, 0) / 19

  sorted = sorted.map(function(lg){
    lg.basis = Math.round((lg.qpct / basis) * 10000) / 100
    return lg
  })

  var formatted = sorted.map(function(lg, i){
    return "[tr][td]" + (i+1) + "[/td][td]" + lg.league + "[/td][td]" + lg.basis + "[/td][td]$RANK_CHANGE[/td][/tr]"
  })

  console.log(formatted.join("\n"))
})

fs.createReadStream('data/LL66_Leaguewide_MD25.csv').pipe(parser);