var options = {
    timePeriod: "current",
    lastLocation: {
        latitude: 0,
        longitude: 0
    }
}

/* Returns a list of urls that you should open*/
function getTabSuggestions() {
    
}

/* Uses chrome.tabs to open all of the tabs from the suggestions*/
function openTabSuggestions(tabs) {
    
}

/* Changes the suggestion options. */
function setSuggestionOptions(newOptions) {
    for (var attr in newOptions) {
        options[attr] = newOptions[attr]
    }
}


