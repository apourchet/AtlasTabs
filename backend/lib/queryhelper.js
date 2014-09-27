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
    console.log("Input length: " + array.length)
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
        var boo = a.url === b.url
        if (boo && a.distance == b.distance) return a.timeDifference > b.timeDifference
        return boo ? a.distance > b.distance : a.url > b.url
    });
    var semiFinalArray = [] 
    var u = ""
    var num = 0
    var sum = 0
    for (var e in myArray){
        if (num == 9) {
            continue
        }
        if (myArray[e].url !== u){
            if (u === "") {
                u = myArray[e].url
                continue
            }
            semiFinalArray.push({url: u, similarity: Math.log(num)/(sum/num)})
            num = 0;
            u = myArray[e].url
            sum = 0
        } else{
            num ++;
            sum += (Math.exp(myArray[e].distance) * Math.exp(myArray[e].timeDifference))
        }
    };
    console.log("SemifinalArray: " + semiFinalArray.length)
    semiFinalArray.sort(function(a,b){
        return a.similarity < b.similarity
    });
    var finalArray = []
    num = 0
    for(var e in semiFinalArray){
        finalArray.push(semiFinalArray[e])
        num++
        if (num == 5)
            break
    };
    return finalArray
}
