var Utils = exports = module.exports

Utils.isUrlValid = function(url) {
    if (url.indexOf("chrome-extension") == 0) {
        return false
    } else if (url.indexOf("chrome://extensions") == 0) {
        return false
    } else if (url.indexOf("chrome://newtab") == 0) {
        return false
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
        if (slashes >= 4) {
            break
        }
        newUrl += c
    }
    return newUrl
}

Utils.cutUrls = function(urls) {
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

Utils.reformatData = function(data) {
    data.location = [Number(data.location[0]), Number(data.location[1])]
    return data
}
