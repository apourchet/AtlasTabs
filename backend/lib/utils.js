var Utils = exports = module.exports

var TOP_SLASH_NUMBER = 3
var BLACK_LIST = ["chrome", "file", "localhost", "127.0.0.1"]

Utils.isUrlValid = function(url) {
    for (var i in BLACK_LIST) {
        if (url.indexOf(BLACK_LIST[i]) == 0) {
            return false
        }
    }
    return true
}

Utils.filterUrls = function(urls) {
    return urls.filter(Utils.isUrlValid)
}

Utils.cutUrl = function(url) {
    var slashes = 0;
    var newUrl = ""
    for (var i in url) {
        var c = url[i]
        if (c == '/') {
            slashes ++
        }
        if (c == '?') {
            break
        }
        if (slashes >= TOP_SLASH_NUMBER) {
            break
        }
        newUrl += c
    }
    return newUrl.replace("http://", "").replace("https://", "")
}

Utils.cutUrls = function(urls) {
    if (!urls) urls = []
    return urls.map(Utils.cutUrl)
}

Utils.removeDuplicates = function(list) {
    return list.filter(function(item, pos) {
            return list.indexOf(item) == pos;
    })
}

Utils.curateUrls = function(urls) {
    return Utils.removeDuplicates(Utils.cutUrls(Utils.filterUrls(urls)))
}

Utils.curateItems = function(items) {
    var joinedUrls = []
    for (var i = 0; i < items.length; i++) {
        joinedUrls.push.apply(joinedUrls, items[i].data.URLs)
    }
    return Utils.removeDuplicates(Utils.cutUrls(Utils.filterUrls(joinedUrls)))
}

Utils.reformatData = function(data) {
    if (!data || !data.location || !data.timeDifference || !data.distance) {
        console.log("Malformed data!")
        return undefined
    }
    data.location = [Number(data.location[0]), Number(data.location[1])]
    data.timeDifference = Number(data.timeDifference)
    data.distance = Number(data.distance)
    data.URLs = Utils.cutUrls(data.URLs)
    data.URLs = data.URLs.filter(Utils.isUrlValid);
    return data
}
