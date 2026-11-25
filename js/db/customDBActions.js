function setDbConf() {
    currentDB = getLocalStorageValue("currentDB");

    if (currentDB !== getLocalStorageValue("latestDB") || currentDB === null) {
        setLocalStorage("currentDB", DB_VERSION);
        setLocalStorage("latestDB", DB_VERSION);
        latestDB = DB_VERSION;
    }
}

function getSelectedIDs() {
    return Array.from(speakers.querySelectorAll('.result-checkbox:checked'), checkbox => Number(checkbox.value));
}

function setResultChecks(checked) {
    speakers.querySelectorAll('.result-checkbox').forEach(checkbox => {
        checkbox.checked = checked;
    });
}

function countTimetable() {
    if (!db) {
        showSnackbar('Results storage is unavailable.', 4000);
        return;
    }
    let transaction = db.transaction(["timeTable"], "readonly").objectStore("timeTable").count();
    transaction.onsuccess = function() {
        if (transaction.result > 0) {
            imgMultiple.src = "img/icons-svg/checkbox-outline.svg";
            multipleEnabled = false;
            tickAll.checked = true;
            hideCheckBoxes();
            printTable();
            titleMeeting.textContent = lngObject.meetingAt + ' ' + moment().format(dateFormat);
            dialogTimeTable.showModal();
        } else
            showSnackbar(lngObject.noSpeakers);
    };
}

function hideCheckBoxes() {
    Array.from(document.getElementsByClassName("tdDel")).forEach(function(element) {
        element.hidden = true;
    });
    document.getElementById('thDel').classList.add('hiddenObject');
}

function showCheckBoxes() {
    Array.from(document.getElementsByClassName("tdDel")).forEach(function(element) {
        element.hidden = false;
    });
    document.getElementById('thDel').classList.remove('hiddenObject');
}

function printTable() {
    speakers.replaceChildren();
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

            const result = cursor.value;
            const row = speakers.insertRow();
            row.id = 'tr' + result.id;
            row.style.background = tempColor;
            row.style.color = defaultColor;
            const selectCell = row.insertCell();
            selectCell.className = 'tdDel ui-data-table__cell--non-numeric';
            selectCell.hidden = !multipleEnabled;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'ui-checkbox result-checkbox';
            checkbox.value = result.id;
            checkbox.checked = tickAll.checked;
            checkbox.setAttribute('aria-label', result.member || lngObject.pMember);
            selectCell.append(checkbox);
            for (const text of [result.member, result.role, result.time]) {
                const cell = row.insertCell();
                cell.className = 'ui-data-table__cell--non-numeric';
                cell.textContent = text;
            }
            cursor.continue();
        }
    };
}

function deleteTimetable() {
    dialogConfirm.showModal();
}

function deleteByIDs() {
    let ids = getSelectedIDs();
    let transaction = db.transaction(["timeTable"], "readwrite");
    for (const id of ids) {
        transaction.objectStore("timeTable").delete(id);
        document.getElementById('tr' + id).remove();
    }
    let objectStoreRequest = transaction.objectStore("timeTable").count();
    objectStoreRequest.onsuccess = function() {
        if (objectStoreRequest.result === 0) {
            showSnackbar(lngObject.noSpeakers);
            dialogTimeTable.close();
        }
        saveData();
    };
    dialogConfirm.close();
}