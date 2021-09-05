function setDbConf() {
    currentDB = getLocalStorageValue("currentDB");

    if (currentDB !== getLocalStorageValue("latestDB") || currentDB === null) {
        setLocalStorage("currentDB", DB_VERSION);
        setLocalStorage("latestDB", DB_VERSION);
        latestDB = DB_VERSION;
    }
}

function getSelectedIDs() {
    let ids = [];
    Array.from(document.getElementsByClassName("chkChoose")).forEach(function(element) {
        if (element.matches('.is-checked'))
            ids.push(parseInt(element.querySelectorAll('input')[0].id.replace("chk", "")));
    });
    return ids;
}

function countTimetable() {
    let transaction = db.transaction(["timeTable"], "readonly").objectStore("timeTable").count();
    transaction.onsuccess = function() {
        if (transaction.result > 0) {
            imgMultiple.src = "img/icons-svg/checkbox-outline.svg";
            hideCheckBoxes();
            printTable();
            dialogTimeTable.showModal();
        } else
            showSnackbar(lngObject.noSpeakers);
    };
}

function hideCheckBoxes() {
    Array.from(document.getElementsByClassName("tdDel")).forEach(function(element) {
        element.style.display = 'none';
    });
    document.getElementById('thDel').classList.add('hiddenObject');
}

function showCheckBoxes() {
    Array.from(document.getElementsByClassName("tdDel")).forEach(function(element) {
        element.style.display = 'block';
    });
    document.getElementById('thDel').classList.remove('hiddenObject');
}

function printTable() {
    let speakersBody = document.getElementById('speakers');
    speakersBody.innerHTML = '';
    results = [];

    let transaction = db.transaction(["timeTable"], "readwrite").objectStore("timeTable").openCursor();

    transaction.onsuccess = function(evt) {
        let cursor = evt.target.result;
        if (cursor) {
            let defaultColor = "white";
            if (cursor.value.lastColor === "yellow" || cursor.value.lastColor === "black" || cursor.value.lastColor === "white")
                defaultColor = "black";

            let tempColor = cursor.value.lastColor;
            if (tempColor === "black")
                tempColor = "white";

            switch (tempColor) {
                case "green":
                    tempColor = greenBgnCss;
                    break;
                case "yellow":
                    tempColor = defYellowBgn;
                    break;
                case "red":
                    tempColor = redBgnCss;
                    break;
            }

            let fT = getSeconds(cursor.value.time);
            let mT = getSeconds(cursor.value.min);

            if (mT - 30 <= fT && fT < mT) {
                tempColor = "#CCFFCC";
                defaultColor = "black";
            }

            if (cursor.value.disqualified) {
                tempColor = "black";
                defaultColor = "white";
            }

            results.push({
                member: cursor.value.member,
                role: cursor.value.role,
                min: cursor.value.min,
                opt: cursor.value.opt,
                max: cursor.value.max,
                time: cursor.value.time,
                lastColor: cursor.value.lastColor,
                disqualified: cursor.value.disqualified
            });

            speakersBody.innerHTML += `<tr id="tr${cursor.value.id}" style="background:${tempColor};color:${defaultColor}"><td class="tdDel mdl-data-table__cell--non-numeric hiddenObject"><label class="chkOpt chkChoose mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="chk${cursor.value.id}"><input type="checkbox" id="chk${cursor.value.id}" class="mdl-checkbox__input" checked="checked" /></label></td><td class="mdl-data-table__cell--non-numeric">${cursor.value.member}</td><td class="mdl-data-table__cell--non-numeric">${cursor.value.role}</td><td class="mdl-data-table__cell--non-numeric">${cursor.value.time}</td></tr>`;
            cursor.continue();
        } else {
            refreshControls();
            addCheckTaps();
        }
    };
}

function addCheckTaps() {
    Array.from(document.querySelectorAll('[id^=chk]')).forEach(function(element) {
        element.addEventListener('change', function() {
            document.getElementById('lblTickAll').MaterialCheckbox.uncheck();
        });
    });
}

function deleteTimetable() {
    dialogConfirm.showModal();
}

function deleteByIDs() {
    let ids = getSelectedIDs();
    let transaction = db.transaction(["timeTable"], "readwrite");
    for (i = 0; i < ids.length; i++) {
        transaction.objectStore("timeTable").delete(ids[i]);
        document.getElementById(`tr${ids[i]}`).style.display = 'none';
    }
    refreshControls();
    let objectStoreRequest = transaction.objectStore("timeTable").count();
    objectStoreRequest.onsuccess = function() {
        if (objectStoreRequest.result === 0) {
            showSnackbar(lngObject.noSpeakers);
            dialogTimeTable.close();
        } else
            addCheckTaps();
        saveData();
    };
    dialogConfirm.close();
}