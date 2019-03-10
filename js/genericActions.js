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