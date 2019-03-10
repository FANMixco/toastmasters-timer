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
	$("input.chkDel[type=checkbox]").each(function () {
		if (this.checked)
			ids.push(parseInt($(this).attr("id").replace("chk", "")));
	});
	return ids;
}

function countTimetable() {
    let transaction = db.transaction(["timeTable"], "readonly").objectStore("timeTable").count();
    transaction.onsuccess = function () {
        if (transaction.result > 0) {
            printTable();
            dialogTimeTable.showModal();
        }
        else {
            console.log('No data');
        }
    };
}

function printTable() {
    $("#speakers").empty();
    results = [];

    let transaction = db.transaction(["timeTable"], "readwrite").objectStore("timeTable").openCursor();

    transaction.onsuccess = function (evt) {
        let cursor = evt.target.result;
        if (cursor) {
            //console.log(cursor.value.time);
            let defaultColor = "white";
            if (cursor.value.lastColor === "yellow" || cursor.value.lastColor === "black" || cursor.value.lastColor === "white" || cursor.value.lastColor === "red" || cursor.value.lastColor === "green")
                defaultColor = "black";

            let tempColor = cursor.value.lastColor;
            if (tempColor === "black")
                tempColor = "white";
            
            switch (tempColor)
            {
                case "green":
                    tempColor = "#60ad5e";
                    break;
                case "yellow":
                    tempColor = "#ffeb3b";
                    break;
                case "red":
                    tempColor = "#e53935";
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

            results.push({ member: cursor.value.member, role: cursor.value.role, min: cursor.value.min, opt: cursor.value.opt, max: cursor.value.max, time: cursor.value.time, lastColor: cursor.value.lastColor, disqualified: cursor.value.disqualified });

            $("#speakers").append(`<tr id="tr${cursor.value.id}" style="background:${tempColor};color:${defaultColor}"><td class="tdDel mdl-data-table__cell--non-numeric" style="display:none"><input id="chk${cursor.value.id}" class="chkDel mdl-data-table__cell--non-numeric" type="checkbox" /></td><td class="mdl-data-table__cell--non-numeric">${cursor.value.member}</td><td class="mdl-data-table__cell--non-numeric">${cursor.value.role}</td><td class="mdl-data-table__cell--non-numeric">${cursor.value.time}</td></tr>`);
            cursor.continue();
        } else
            if ($('#timeTable').height() >= document.body.clientHeight * 0.9)
                document.getElementById('divSpeakers').style.height = `${document.body.clientHeight * 0.53}px`;
    };
}

function deleteTimetable() {
    var objectStoreRequest = db.transaction(["timeTable"], "readwrite").objectStore("timeTable").clear();
	objectStoreRequest.onsuccess = function(event) {
		saveData();
        dialogTimeTable.close();
	};
}

function deleteByIDs(ids) {
    let transaction = db.transaction(["timeTable"], "readwrite");
    for (i = 0; i < ids.length; i++) {
        transaction.objectStore("timeTable").delete(ids[i]);
        $(`#tr${ids[i]}`).hide();
    }
    saveData();
    return transaction.objectStore("timeTable").count();
}