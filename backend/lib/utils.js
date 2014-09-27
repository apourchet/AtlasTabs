var Utils = exports = module.exports

var TOP_SLASH_NUMBER = 3

Utils.isUrlValid = function(url) {
    if (url.indexOf("chrome-extension") == 0) {
        return false
    } else if (url.indexOf("chrome://extensions") == 0) {
        return false
    } else if (url.indexOf("chrome://newtab") == 0) {
        return false
    } else if (url.indexOf("chrome-") == 0) {
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
        if (slashes >= TOP_SLASH_NUMBER) {
            break
        }
        newUrl += c
    }
    return newUrl.replace("http://", "").replace("https://", "")
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

Utils.curateItems = function(items) {
    var joinedUrls = []
    for (var i = 0; i < items.length; i++) {
        joinedUrls.push.apply(joinedUrls, items[i].data.URLs)
    }
    return Utils.removeDuplicates(Utils.cutUrls(Utils.filterUrls(joinedUrls)))
}

Utils.reformatData = function(data) {
    data.location = [Number(data.location[0]), Number(data.location[1])]
    data.timeDifference = Number(data.timeDifference)
    data.distance = Number(data.distance)
    return data
}
