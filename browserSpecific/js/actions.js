let audioBeepElement, audioElementClapping;
let os = getMobileOperatingSystem();
let nMobile = (os === "iOS" || os === "Android");
let requestWakeLock;

function browserChangeTitle(currentTime) {
    document.title = currentTime !== '' ? `${currentTime} - Toastmasters Timer` : `Toastmasters Timer`;
}

function browserChangeFavIcon(fav) {
    document.querySelector("link[rel*='icon']").href = fav === '' ? `img/favicon-32x32.png` : `img/${fav}.png`;
}

function browserStartBeep() {
    if (!nMobile) {
        if (green === 1 || yellow === 1 || red === 1) {
            audioBeepElement.play();
            setTimeout(() => {
                audioBeepElement.pause();
            }, 1000);
        } else {
            audioBeepElement.pause();
        }
    }
}

function browserStartVibrate() {
    if ((green === 1 || yellow === 1 || red === 1) && hasVibrator) {
        navigator.vibrate(1000);
    }
}

function browserStartClapping() {
    if (!nMobile) {
        audioElementClapping.play();
        setTimeout(() => {
            audioElementClapping.pause();
        }, 1500);
    }
}

function browserStopClapping() {
    if (!nMobile) {
        audioElementClapping.pause();
    }
}

function activateWakeLock() {
    try {
        navigator.getWakeLock("screen").then((wakeLock) => {
            request = wakeLock.createRequest();
        });
    }
    catch (e) { }
}

function deactivateWakeLock() {
    try {
        if (request) {
            request.cancel();
        }
    }
    catch (e) { }
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
    setTimeout(() => {
        const dText = document.getElementById('titleMeeting').innerHTML;
        // Ensure jsPDF is correctly referenced
        const { jsPDF } = window.jspdf;

        let doc = new jsPDF('landscape', 'pt', 'a4');

        // Define header
        function addHeader(data) {
            doc.setFontSize(12);
            doc.setTextColor(40);
            doc.text(dText, data.settings.margin.left, 30);
        }

        // Define footer
        function addFooter(data) {
            let pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(40);
            let str = 'Created by Federico Navarrete, federiconavarrete.com';
            doc.textWithLink(str, data.settings.margin.left, doc.internal.pageSize.height - 30, { url: "https://federiconavarrete.com" });
        }

        // Convert HTML table to JSON
        let res = doc.autoTableHtmlToJson(document.getElementById("tblResults"));

        // Draw table with header and footer
        doc.autoTable({
            head: [res.columns], // Columns as an array of strings
            body: res.data,      // Rows as an array of arrays of strings
            startY: 60,
            margin: { top: 50, bottom: 30 },
            didDrawPage: function (data) {
                // Header
                doc.setFontSize(12);
                doc.setTextColor(40);
                doc.text(dText, data.settings.margin.left, 30);

                // Footer
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFontSize(8);
                doc.setTextColor(40);
                const str = 'Exported by Toastmasters Timer. Created by Federico Navarrete, federiconavarrete.com';
                doc.textWithLink(str, data.settings.margin.left, doc.internal.pageSize.height - 30, { url: 'https://federiconavarrete.com' });
            }
        });

        // Save the PDF
        doc.save(`${dText.replace(/ /g, '_')}.pdf`);
    }, 250);
}