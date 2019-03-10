function setLocalStorage(key, val) {
    if (getLocalStorageValue(key) !== null)
        removeLocalStorage(key);
    localStorage.setItem(key, val);
}

function getLocalStorageValue(key) {
    return localStorage.getItem(key);
}

function removeLocalStorage(key) {
    localStorage.removeItem(key);
}

function getSeconds(hms) {
    //console.log(hms);
    let a = hms.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    return (+a[0]) * 3600 + (+a[1]) * 60 + (+a[2]);
}