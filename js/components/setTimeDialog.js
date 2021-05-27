const btnSetTime = document.getElementById('btnSetTime'),
    btnClearTime = document.getElementById('btnClearTime'),
    dialogSetTime = document.getElementById('setTimeDialog'),
    txtH = document.getElementById('txtH'),
    txtM = document.getElementById('txtM'),
    txtS = document.getElementById('txtS'),
    btnUpS = document.getElementById('btnUpS'),
    btnUpM = document.getElementById('btnUpM'),
    btnUpH = document.getElementById('btnUpH'),
    btnDownS = document.getElementById('btnDownS'),
    btnDownM = document.getElementById('btnDownM'),
    btnDownH = document.getElementById('btnDownH');

let btnUpSPressed = false,
    btnDownSPressed = false,
    btnUpMPressed = false,
    btnDownMPressed = false,
    btnUpHPressed = false,
    btnDownHPressed = false,
    hasCustomChange = false;

let chosenInputText = "";
let i = 0, j = 0, k = 0, timeOutS = 0, timeOutM = 0, timeOutH = 0;

if (!dialogSetTime.showModal) {
    dialogPolyfill.registerDialog(dialogSetTime);
}

btnSetTime.addEventListener('click', function() {
    document.getElementById(`${chosenInputText}`).parentElement.MaterialTextfield.change(`${txtH.value}:${txtM.value}:${txtS.value}`);
    hasCustomChange = true;
    dialogSetTime.close();
});

btnClearTime.addEventListener('click', function() {
    setTimeControls('00', '00', '00');
    clearIntervals();
    enableButtons(false);
});

dialogSetTime.querySelector('.close').addEventListener('click', function() {
    clearIntervals();
    dialogSetTime.close();
});

btnUpS.addEventListener('mousedown', btnUpSContinuesPress);
btnUpS.addEventListener('touchstart', btnUpSContinuesPress, {passive: true});
btnUpS.addEventListener('mouseup', btnSReleased);
btnUpS.addEventListener('mouseleave', btnSReleased);
btnUpS.addEventListener('touchend', btnSReleased);
btnUpS.addEventListener('click', btnUpSClick);

btnUpM.addEventListener('mousedown', btnUpMContinuesPress);
btnUpM.addEventListener('touchstart', btnUpMContinuesPress, {passive: true});
btnUpM.addEventListener('mouseup', btnMReleased);
btnUpM.addEventListener('mouseleave', btnMReleased);
btnUpM.addEventListener('touchend', btnMReleased);
btnUpM.addEventListener('click', btnUpMClick);

btnUpH.addEventListener('mousedown', btnUpHContinuesPress);
btnUpH.addEventListener('touchstart', btnUpHContinuesPress, {passive: true});
btnUpH.addEventListener('mouseup', btnHReleased);
btnUpH.addEventListener('mouseleave', btnHReleased);
btnUpH.addEventListener('touchend', btnHReleased);
btnUpH.addEventListener('click', btnUpHClick);

btnDownS.addEventListener('mousedown', btnDownSContinuesPress);
btnDownS.addEventListener('touchstart', btnDownSContinuesPress, {passive: true});
btnDownS.addEventListener('mouseup', btnSReleased);
btnDownS.addEventListener('mouseleave', btnSReleased);
btnDownS.addEventListener('touchend', btnSReleased);
btnDownS.addEventListener('click', btnDownSClick);

btnDownM.addEventListener('mousedown', btnDownMContinuesPress);
btnDownM.addEventListener('touchstart', btnDownMContinuesPress, {passive: true});
btnDownM.addEventListener('mouseup', btnMReleased);
btnDownM.addEventListener('mouseleave', btnMReleased);
btnDownM.addEventListener('touchend', btnMReleased);
btnDownM.addEventListener('click', btnDownMClick);

btnDownH.addEventListener('mousedown', btnDownHContinuesPress);
btnDownH.addEventListener('touchstart', btnDownHContinuesPress, {passive: true});
btnDownH.addEventListener('mouseup', btnHReleased);
btnDownH.addEventListener('mouseleave', btnHReleased);
btnDownH.addEventListener('touchend', btnHReleased);
btnDownH.addEventListener('click', btnDownHClick);

function timeDialogInvert(opt) {
    if (opt === 1) {
		setInvFilter(dialogSetTime, invert100);
		setBgd(dialogSetTime, bgColors[2]);
	} else {
		setInvFilter(dialogSetTime, invert0);
		setBgd(dialogSetTime, bgColors[0]);
	}
}

function btnUpSContinuesPress() {
    if (btnUpSPressed) return;
    btnUpSPressed = true;
    if (parseInt(txtS.value) > 0)
        i = parseInt(txtS.value);
    timeOutS = setInterval(function() {
        i++;
        if (i < 60)
            txtS.value = `${i < 10 ? '0' : ''}${i}`;
        else {
            i = 0;
            let m = parseInt(txtM.value) + 1;
            if (m < 60) {
                txtM.value = `${m < 10 ? '0' : ''}${m}`;
                txtS.value = i;
            } else {
                let h = parseInt(txtH.value) + 1;
                if (h === 100) {
                    setTimeControls('99', '59', '59');
                    enableButtons(true);
                    btnSReleased();
                } else {
                    txtM.value = 0;
                    txtH.value = `${h < 10 ? '0' : ''}${h}`;
                }
            }
        }
    }, 100);
}

function btnUpSClick() {
    if (btnUpSPressed) return;
    btnUpSPressed = true;
    if (parseInt(txtS.value) > 0)
        i = parseInt(txtS.value);
    i++;
    if (i < 60)
        txtS.value = `${i < 10 ? '0' : ''}${i}`;
    else {
        i = 0;
        let m = parseInt(txtM.value) + 1;
        if (m < 60) {
            txtM.value = `${m < 10 ? '0' : ''}${m}`;
            txtS.value = i;
        } else {
            let h = parseInt(txtH.value) + 1;
            if (h === 100) {
                setTimeControls('99', '59', '59');
                enableButtons(true);
                btnSReleased();
            } else {
                txtM.value = 0;
                txtH.value = `${h < 10 ? '0' : ''}${h}`;
            }
        }
    }
}

function btnDownSContinuesPress() {
    if (btnDownSPressed) return;
    btnDownSPressed = true;
    enableButtons(false);
    if (parseInt(txtS.value) > 0)
        i = parseInt(txtS.value);
    timeOutS = setInterval(function() {
        i--;
        if (i >= 0)
            txtS.value = `${i < 10 ? '0' : ''}${i}`;
        else
            btnSReleased();
    }, 100);
}

function btnDownSClick() {
    if (btnDownSPressed) return;
    btnDownSPressed = true;
    enableButtons(false);
    if (parseInt(txtS.value) > 0)
        i = parseInt(txtS.value);
    i--;
    if (i >= 0)
        txtS.value = `${i < 10 ? '0' : ''}${i}`;
    else
        btnSReleased();
}

function btnSReleased() {
    btnDownSPressed = false;
    btnUpSPressed = false;
    i = 0;
    clearInterval(timeOutS);
    timeOutS = 0;
}

function btnUpMContinuesPress() {
    if (btnUpMPressed) return;
    btnUpMPressed = true;
    if (parseInt(txtM.value) > 0)
        j = parseInt(txtM.value);
    timeOutM = setInterval(function() {
        j++;
        if (j < 60)
            txtM.value = `${j < 10 ? '0' : ''}${j}`;
        else {
            j = 0;
            let h = parseInt(txtH.value) + 1;
            if (h === 100) {
                setTimeControls('99', '59', '59');
                enableButtons(true);
                btnMReleased();
            } else {
                txtM.value = 0;
                txtH.value = `${h < 10 ? '0' : ''}${h}`;
            }
        }
    }, 100);
}

function btnUpMClick() {
    if (btnUpMPressed) return;
    btnUpMPressed = true;
    if (parseInt(txtM.value) > 0)
        j = parseInt(txtM.value);
    j++;
    if (j < 60)
        txtM.value = `${j < 10 ? '0' : ''}${j}`;
    else {
        j = 0;
        let h = parseInt(txtH.value) + 1;
        if (h === 100) {
            setTimeControls('99', '59', '59');
            enableButtons(true);
            btnMReleased();
        } else {
            txtM.value = 0;
            txtH.value = `${h < 10 ? '0' : ''}${h}`;
        }
    }
}

function btnDownMContinuesPress() {
    if (btnDownMPressed) return;
    btnDownMPressed = true;
    enableButtons(false);
    if (parseInt(txtM.value) >= 0)
        j = parseInt(txtM.value);
    timeOutM = setInterval(function() {
        j--;
        if (j >= 0)
            txtM.value = `${j < 10 ? '0' : ''}${j}`;
        else
            btnMReleased();
    }, 100);
}

function btnDownMClick() {
    if (btnDownMPressed) return;
    btnDownMPressed = true;
    enableButtons(false);
    if (parseInt(txtM.value) > 0)
        j = parseInt(txtM.value);
    j--;
    if (j >= 0)
        txtM.value = `${j < 10 ? '0' : ''}${j}`;
    else
        btnMReleased();
}

function btnMReleased() {
    btnDownMPressed = false;
    btnUpMPressed = false;
    j = 0;
    clearInterval(timeOutM);
    timeOutM = 0;
}

function btnUpHContinuesPress() {
    if (btnUpHPressed) return;
    btnUpHPressed = true;
    if (parseInt(txtH.value) > 0)
        k = parseInt(txtH.value);
    timeOutH = setInterval(function() {
        k++;
        if (k === 100) {
            setTimeControls('99', '59', '59');
            enableButtons(true);
            btnHReleased();
        } else
            txtH.value = `${k < 10 ? '0' : ''}${k}`;
    }, 100);
}

function btnUpHClick() {
    if (btnUpHPressed) return;
    btnUpHPressed = true;
    if (parseInt(txtH.value) > 0)
        k = parseInt(txtH.value);
    k++;
    if (k === 100) {
        setTimeControls('99', '59', '59');
        enableButtons(true);
        btnHReleased();
    } else
        txtH.value = `${k < 10 ? '0' : ''}${k}`;
}

function btnDownHContinuesPress() {
    if (btnDownHPressed) return;
    btnDownHPressed = true;
    enableButtons(false);
    if (parseInt(txtH.value) > 0)
        k = parseInt(txtH.value);
    timeOutH = setInterval(function() {
        k--;
        if (k >= 0)
            txtH.value = `${k < 10 ? '0' : ''}${k}`;
        else
            btnHReleased();
    }, 100);
}

function btnDownHClick() {
    if (btnDownHPressed) return;
    btnDownHPressed = true;
    enableButtons(false);
    if (parseInt(txtH.value) > 0)
        k = parseInt(txtH.value);
    k--;
    if (k >= 0)
        txtH.value = `${k < 10 ? '0' : ''}${k}`;
    else
        btnHReleased();
}

function btnHReleased() {
    btnDownHPressed = false;
    btnUpHPressed = false;
    k = 0;
    clearInterval(timeOutH);
    timeOutH = 0;
}

function setTimeControls(h, m, s) {
    txtH.value = h;
    txtM.value = m;
    txtS.value = s;
}

function openSetDialog(time) {
    let unit = time.split(":");
    setTimeControls(unit[0], unit[1], unit[2]);
    if (time === '99:59:59')
        enableButtons(true);
}

function setNewTime(inputText, currentTxt) {
    clearIntervals();
    chosenInputText = inputText;
    if (currentTxt === '00:00:00' || currentTxt === '' || currentTxt === undefined) {
        setTimeControls('00', '00', '00');
        enableButtons(false);
    } else
        openSetDialog(currentTxt);
    try {
        dialogSetTime.showModal();
    } catch (e) { console.log(e); }
}

function clearIntervals() {
    if (timeOutS !== 0)
        btnSReleased();
    if (timeOutM !== 0)
        btnMReleased();
    if (timeOutH !== 0)
        btnHReleased();
}

function enableButtons(disabled) {
    btnUpS.disabled = disabled;
    btnUpM.disabled = disabled;
    btnUpH.disabled = disabled;
}
