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

const timerStatus = document.getElementById('snackbarMsg');
const statusQueue = [];
let statusTimeout;

function showSnackbar(message, timeout = 1500) {
    statusQueue.push({ message, timeout: timeout || 2750 });
    if (statusTimeout === undefined) showNextStatus();
}

function showNextStatus() {
    const next = statusQueue.shift();
    if (!next) {
        statusTimeout = undefined;
        timerStatus.classList.remove('is-visible');
        timerStatus.textContent = '';
        return;
    }
    timerStatus.textContent = next.message;
    timerStatus.classList.add('is-visible');
    statusTimeout = setTimeout(showNextStatus, next.timeout);
}
