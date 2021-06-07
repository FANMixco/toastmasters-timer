let audioBeepElement, audioElementClapping;
let os = getMobileOperatingSystem();
let nMobile = (os === "iOS" || os === "Android");
let requestWakeLock;

function browserChangeTitle(currentTime) {
    document.title = currentTime !== '' ? `${currentTime} - Toastmasters Timer` : `Toastmasters Timer`;
}

function browserChangeFavIcon(fav){
    document.querySelector("link[rel*='icon']").href = fav === '' ? `img/favicon-32x32.png` : `img/${fav}.png`;
}

function browserStartBeep() {
    if (!nMobile) {
        if (green === 1 || yellow === 1 || red === 1) {
            audioBeepElement.play();
            setTimeout(function() {
                audioBeepElement.pause();
            }, 1000);
        } else {
            audioBeepElement.pause();
        }
    }
}

function browserStartVibrate() {
    if ((green === 1 || yellow === 1 || red === 1) && hasVibrator)
        navigator.vibrate(1000);
}

function browserStartClapping() {
    if (!nMobile) {
        audioElementClapping.play();
        setTimeout(function() {
            audioElementClapping.pause();
        }, 1500);
    }
}

function browserStopClapping() {
    if (!nMobile)
        audioElementClapping.pause();
}

function activateWakeLock() {
	try {
		navigator.getWakeLock("screen").then(function(wakeLock) {
			request = wakeLock.createRequest();
		});
	}
	catch (e) {	}
}

function deactivateWakeLock() {
	try {
		if (request)
			request.cancel();
	}
	catch (e) {	}
}

if (!nMobile) {
    audioBeepElement = document.createElement('audio');
    audioBeepElement.src = './browserSpecific/sounds/beep.mp3';
    audioBeepElement.load();

    audioElementClapping = document.createElement('audio');
    audioElementClapping.src = './browserSpecific/sounds/clapping.mp3';
    audioElementClapping.load();
    
    btnVibrate.style.display = 'none';
    btnShare.style.display = 'none';
    btnEmail.style.display = 'none';

    document.body.insertBefore(audioBeepElement, document.getElementById("snackbarMsg"));
    document.body.insertBefore(audioElementClapping, document.getElementById("snackbarMsg"));
} else {
    btnClap.style.display = 'none';
    btnBeep.style.display = 'none';
}

function browserExport() {
    showSnackbar(lngObject.lblExportMsg);
    setTimeout(function() {
        let doc = new jsPDF('l', 'pt', 'a4');
        let res = doc.autoTableHtmlToJson(document.getElementById("tblResults"));
        doc.autoTable(res.columns, res.data, {
            startY: 60
        });
        doc.save();
    }, 250);
}