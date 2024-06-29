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
            doc.setFontSize(8);
            doc.setTextColor(40);
            let str = 'Exported by Toastmasters Timer. Created by Federico Navarrete, federiconavarrete.com';
            doc.textWithLink(str, data.settings.margin.left, doc.internal.pageSize.height - 30, { url: "https://federiconavarrete.com" });
        }

        // Convert hex color to RGB
        function hexToRgb(hex) {
            let bigint = parseInt(hex.slice(1), 16);
            let r = (bigint >> 16) & 255;
            let g = (bigint >> 8) & 255;
            let b = bigint & 255;
            return [r, g, b];
        }

        // Get the color of the row
        function getRowColor(rowElement) {
            let style = window.getComputedStyle(rowElement);
            let bgColor = style.backgroundColor;
            let color = style.color;

            if (bgColor.startsWith('#')) {
                bgColor = hexToRgb(bgColor);
            } else if (bgColor.startsWith('rgb')) {
                bgColor = bgColor.match(/\d+/g).map(Number);
            }

            if (color.startsWith('#')) {
                color = hexToRgb(color);
            } else if (color.startsWith('rgb')) {
                color = color.match(/\d+/g).map(Number);
            }

            return {
                fillColor: bgColor,
                textColor: color
            };
        }

        // Convert HTML table to JSON
        let table = document.getElementById("tblResults");
        let res = doc.autoTableHtmlToJson(table);
        //let totalCols = 0;

        // Draw table with header and footer
        doc.autoTable({
            head: [res.columns], // Columns as an array of strings
            body: res.data,      // Rows as an array of arrays of strings
            startY: 60,
            margin: { top: 50, bottom: 30 },
            didDrawPage: function (data) {
                // Header
                addHeader(data);

                // Footer
                addFooter(data);
            },
            didParseCell: function (data) {
                if (data.row.section === 'body') { // Process only body rows
                    let rowIndex = data.row.index;
                    let rowElement = table.rows[rowIndex + 1]; // Skip the header row

                    // Extract colors for the current row
                    let colors = getRowColor(rowElement);

                    // Apply the extracted styles
                    data.cell.styles.fillColor = colors.fillColor;
                    data.cell.styles.textColor = colors.textColor;
                }
            }
        });

        // Save the PDF
        doc.save(`${dText.replace(/ /g, '_').replace(/\//g, '_')}.pdf`);
        insertIAd();
    }, 250);
}