let audioBeepElement, audioElementClapping;
let os = getMobileOperatingSystem();

function browserStartBeep() {
    if (isBeepEnabled === "true" && !(os == "iOS" || os == "Android")) {
        if (green === 1 || yellow === 1 || red === 1) {
            audioElement.play();
            setTimeout(function() {
                audioElement.pause();
            }, 500);
        } else {
            audioElement.pause();
        }
    }
}

function browserStartVibrate() {
    if (isVibrateEnabled === "true")
        if (green === 1 || yellow === 1 || red === 1)
			if (hasVibrator)
                navigator.vibrate(1000);
}

function browserStartClapping() {
    if (isClappingEnabled === "true" && !(os == "iOS" || os == "Android"))
    {
        audioElementClapping.play();
        setTimeout(function() {
            audioElementClapping.pause();
        }, 1500);
    }
}

function browserStopClapping() {
    if (!(os == "iOS" || os == "Android"))
	    audioElementClapping.pause();
}

if (!(os == "iOS" || os == "Android")) {
    audioElement = document.createElement('audio');
    audioElement.setAttribute('src', './browserSpecific/sounds/beep.mp3');

    audioElement.addEventListener('ended', function() {
    this.play();
    }, false);

    audioElement.addEventListener("canplay", function() {});

    audioElement.addEventListener("timeupdate", function() {});

    audioElementClapping = document.createElement('audio');
    audioElementClapping.setAttribute('src', './browserSpecific/sounds/clapping.mp3');

    audioElementClapping.addEventListener('ended', function() {
    this.play();
    }, false);

    audioElementClapping.addEventListener("canplay", function() {});

    audioElementClapping.addEventListener("timeupdate", function() {});

    btnVibrate.style.display = 'none';
    btnShare.style.display = 'none';
    btnEmail.style.display = 'none';
} else {
    btnClap.style.display = 'none';
    btnBeep.style.display = 'none';
}

function browserExport() {
    showSnackbar(lngObject.lblExportMsg);
    setTimeout(function() {
        var doc = new jsPDF('l', 'pt', 'a4');
        var res = doc.autoTableHtmlToJson(document.getElementById("tblResults"));
        doc.autoTable(res.columns, res.data, {
            startY: 60
        });
        doc.save();
    }, 250);
}
