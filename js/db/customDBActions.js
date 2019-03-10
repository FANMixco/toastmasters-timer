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
            dialogTimeTable.showModal();
        }
        else {
            console.log('No data');
        }
    };
}

function printTable() {
    $("#tBodyResults").empty();
    results = [];

    let transaction = db.transaction(["timeTable"], "readwrite").objectStore("timeTable").openCursor();

    transaction.onsuccess = function (evt) {
        let cursor = evt.target.result;
        if (cursor) {
            let defaultColor = "white";
            if (cursor.value.lastColor === "yellow" || cursor.value.lastColor === "black" || cursor.value.lastColor === "white")
                defaultColor = "black";

            let tempColor = cursor.value.lastColor;
            if (tempColor === "black")
                tempColor = "white";

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

            $("#tBodyResults").append(`<tr id="tr${cursor.value.id}" style="background:${tempColor};color:${defaultColor}"><td class="tdDel" style="display:none"><input id="chk${cursor.value.id}" class="chkDel" type="checkbox" /></td><td>${cursor.value.member}</td><td>${cursor.value.role}</td><td style="text-align:center">${cursor.value.time}</td></tr>`);
            cursor.continue();
        } else {
            $("#divResults").modal().on('shown.bs.modal', function (w) {
                resizeModal();
                w.stopPropagation();
            });
        }
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