let audioBeepElement, audioElementClapping, videoWakeUp;
let os = getMobileOperatingSystem();
let nMobile = (os === "iOS" || os === "Android");

function browserStartBeep() {
    if (!nMobile) {
        if (green === 1 || yellow === 1 || red === 1) {
            audioBeepElement.play();
            setTimeout(function() {
                audioBeepElement.pause();
            }, 500);
        } else {
            audioBeepElement.pause();
        }
    }
}

function browserStartVibrate() {
    if (green === 1 || yellow === 1 || red === 1)
        if (hasVibrator)
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

function playVideo() {
    videoWakeUp.click();
}

function stopVideo() {
    videoWakeUp.click();
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

videoWakeUp = document.createElement('video');
videoWakeUp.src = './browserSpecific/videos/wakeup.mp4';
videoWakeUp.style.height = '0px';
videoWakeUp.style.width = '0px';
videoWakeUp.style.zIndex = "9999";
videoWakeUp.style.position = "absolute";
videoWakeUp.muted = true;
videoWakeUp.loop = true;
videoWakeUp.autoplay = false;
videoWakeUp.load();
videoWakeUp.addEventListener(
    'play', 
    function() { 
        videoWakeUp.play();
    }, 
    false);

videoWakeUp.onclick = function() {
    if (videoWakeUp.paused) {
        videoWakeUp.play();
    } else {
        videoWakeUp.pause();
    }

    return false;
};

document.body.insertBefore(videoWakeUp, document.querySelector("footer"));

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