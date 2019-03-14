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
	$(".chkChoose").each(function () {
		if ($(this).is('.is-checked'))
			ids.push(parseInt($(this).find('input').attr("id").replace("chk", "")));
	});
	return ids;
}

function countTimetable() {
    let transaction = db.transaction(["timeTable"], "readonly").objectStore("timeTable").count();
    transaction.onsuccess = function () {
        if (transaction.result > 0) {
            btnMultiple.innerHTML = "<span class='mdi mdi-check-box-outline'></span>";
            $(".tdDel,#thDel").hide();
            printTable();
            dialogTimeTable.showModal();
        }
        else
            showSnackbar(lngObject.noSpeakers);
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
            if (cursor.value.lastColor === "yellow" || cursor.value.lastColor === "black" || cursor.value.lastColor === "white")
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

            $("#speakers").append(`<tr id="tr${cursor.value.id}" style="background:${tempColor};color:${defaultColor}"><td class="tdDel mdl-data-table__cell--non-numeric hiddenObject"><label class="chkOpt chkChoose mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="chk${cursor.value.id}"><input type="checkbox" id="chk${cursor.value.id}" class="mdl-checkbox__input" checked></label></td><td class="mdl-data-table__cell--non-numeric">${cursor.value.member}</td><td class="mdl-data-table__cell--non-numeric">${cursor.value.role}</td><td class="mdl-data-table__cell--non-numeric">${cursor.value.time}</td></tr>`);
            cursor.continue();
        } else {
            componentHandler.upgradeAllRegistered();
            if ($('#timeTable').height() >= document.body.clientHeight * 0.9)
                document.getElementById('divSpeakers').style.height = `${document.body.clientHeight * 0.53}px`;
            else
                document.getElementById('divSpeakers').style.height = 'auto';
        }
    };
}

function deleteTimetable() {
    dialogConfirm.showModal();
}

function deleteByIDs() {
	let ids = getSelectedIDs();
    let transaction = db.transaction(["timeTable"], "readwrite");
    for (i = 0; i < ids.length; i++) {
		transaction.objectStore("timeTable").delete(ids[i]);
		$(`#tr${ids[i]}`).hide();
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
