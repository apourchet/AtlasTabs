var QueryHelper = exports = module.exports;

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