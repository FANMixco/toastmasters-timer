var db;
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

function dbConn() {
    //Request db creation if it doesn't exist
    let request = window.indexedDB.open("tmTimerDB", 1);
    request.onerror = function(evt) {
        console.log("Database error code: " + evt.target.errorCode);
    };
    request.onsuccess = function() {
        db = request.result;
        //Clear all data from the previous meeting
        if (isNewMeeting())
            clearTimetable();
        else {
            let transaction = db.transaction(["timeTable"], "readonly").objectStore("timeTable").count();
            transaction.onsuccess = function() {
                if (transaction.result === 0)
                    restoreData();
            };
        }
    };

    //Create tables
    request.onupgradeneeded = function(evt) {
        let objectStore = evt.currentTarget.result.createObjectStore("timeTable", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("member", "member", { unique: false });
        objectStore.createIndex("role", "role", { unique: false });
        objectStore.createIndex("min", "min", { unique: false });
        objectStore.createIndex("opt", "opt", { unique: false });
        objectStore.createIndex("max", "max", { unique: false });
        objectStore.createIndex("time", "time", { unique: false });
        objectStore.createIndex("lastColor", "lastColor", { unique: false });
        objectStore.createIndex("disqualified", "disqualified", { unique: false });
    };
}

function initializeDB(currentVersion, latestVersion) {
    if (latestVersion !== currentVersion) {
        try { window.indexedDB.deleteDatabase("tmTimerDB"); }
        catch (e) { }
    }
    dbConn();
}

function clearTimetable() {
    var objectStoreRequest = db.transaction(["timeTable"], "readwrite").objectStore("timeTable").clear();
    objectStoreRequest.onsuccess = function() {
        saveData();
    };
}

//This function is for verifying if it's the current meeting or a new one
function isNewMeeting() {
    let currentDate = moment((new Date())).format("YYYY/MM/DD");
    if (getLocalStorageValue("meetingDate") === null) {
        setLocalStorage("meetingDate", currentDate);
        return true;
    } else if (getLocalStorageValue("meetingDate") !== currentDate) {
        removeLocalStorage("meetingDate");
        setLocalStorage("meetingDate", currentDate);
        return true;
    }
    return false;
}

function addNewTime(member, role, min, opt, max, time, lastColor, disqualified) {
    if (time !== 'Invalid date' && !(lastColor === "white" && max === time)) {
        let objectStoreRequest = db.transaction(["timeTable"], "readwrite").objectStore("timeTable").add({
            member: member,
            role: role,
            min: min,
            opt: opt,
            max: max,
            time: time,
            lastColor: lastColor,
            disqualified: disqualified
        });
        objectStoreRequest.onsuccess = function(event) {
            saveData();
            showSnackbar(lngObject.recorded);
        };
    }
}

function restoreData() {
    if (moment((new Date())).format("YYYY/MM/DD") === getLocalStorageValue("backUpDate")) {
        for (let item in JSON.parse(`[${getLocalStorageValue("backUpTT")}]`))
            addNewTime(item.member, item.role, item.min, item.opt, item.max, item.time, item.lastColor, item.disqualified);
    }
}

function saveData() {
    let transaction = db.transaction(["timeTable"], "readwrite").objectStore("timeTable").openCursor();

    let data = [];
    transaction.onsuccess = function(evt) {
        let cursor = evt.target.result;
        if (cursor) {
            data.push(JSON.stringify(cursor.value));
            cursor.continue();
        } else {
            setLocalStorage("backUpDate", moment((new Date())).format("YYYY/MM/DD"));
            setLocalStorage("backUpTT", data);
        }
    };
}