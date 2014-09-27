var QueryHelper = exports = module.exports;

var Utils = require("./utils")

QueryHelper.getTimeDifferenceMinutes = function(n) {
    var curr = new Date().getTime()
    return (Math.abs(curr-n))/60000
}

QueryHelper.getEuclideanDistance = function(lo, la, longitude, latitude) {
    var  lat = latitude - la
    var  lon = longitude - lo
    return Math.sqrt(lat*lat + lon*lon)
}

QueryHelper.getTimeSimilarity = function(mins){
    var curDate = new Date()
    var curr = curDate.getHours() * 60 + curDate.getMinutes()
    var diff = Math.abs(curr - mins)
    return diff <= 720 ? diff : (1440 - diff)
}

QueryHelper.getSuggestedURLs = function(array, lon, lat){
    for (var e in array){
        var el = array[e].data;
        array[e].data.distance = QueryHelper.getEuclideanDistance(lon, lat, el.location[0], el.location[1])
        var thenDate = new Date(array[e].createdAt)
        array[e].data.timeDifference = QueryHelper.getTimeSimilarity(thenDate.getHours() * 60 + thenDate.getMinutes())
    };
    var myArray = []
    for (var e in array){
        var elem = Utils.filterUrls(array[e].data.URLs)
        var td = array[e].data.timeDifference
        var d = array[e].data.distance
        for(var f in elem){
            myArray.push({url: Utils.cutUrl(elem[f]), timeDifference: td, distance: d})
        };
    };
    myArray.sort(function(a,b) {
        return a.url > b.url ? 1 : -1
    });
    var semiFinalArray = [] 
    var u = myArray[0].url
    var sim = []
    for (var i = 0; i < myArray.length; i++){
        var s = Math.exp(myArray[0].distance) + Math.exp(myArray[0].timeDifference)
        if (u === myArray[i].url){
            sim.push(s)
        }
        else {
            semiFinalArray.push({url: u, similarities: sim.sort()})
            u = myArray[i].url
            sim = [s]
        }
    };
    finalArray = []
    for (var elem in semiFinalArray){
        var sum = 0
        var num = 0
        for (var e in semiFinalArray[elem].similarities){
            num ++
            sum += semiFinalArray[elem].similarities[e]
            if (num == 10)
                break
        }
        finalArray.push({url: semiFinalArray[elem].url, sim: (Math.log(num)/(sum/num))})
    }
    finalArray.sort(function(a,b){
        return a.sim < b.sim
    })
    var returnArray = []
    for (var i = 0; i < 5 && i < finalArray.length; i++){
        returnArray.push(finalArray[i].url)
    }
    return returnArray
}
