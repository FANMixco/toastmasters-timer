const btnSetTime = document.getElementById('btnSetTime'),
    btnClearTime = document.getElementById('btnClearTime'),
    dialogSetTime = document.getElementById('setTimeDialog'),
    txtH = document.getElementById('txtH'),
    txtM = document.getElementById('txtM'),
    txtS = document.getElementById('txtS');

let chosenInputText = "";
let i = 0, j = 0, k = 0, timeOutS = 0, timeOutM = 0, timeOutH = 0;

btnSetTime.addEventListener('click', function () {
    $(`#${chosenInputText}`)[0].parentElement.MaterialTextfield.change(`${txtH.value}:${txtM.value}:${txtS.value}`);
    removeDialogFromStack('setTime');
    dialogSetTime.close();
});

btnClearTime.addEventListener('click', function () {
    setTimeControls('00', '00', '00');
    enableButtons(false);
});

dialogSetTime.querySelector('.close').addEventListener('click', function () {
    removeDialogFromStack('setTime');
    dialogSetTime.close();
});

if (!dialogSetTime.showModal) {
    dialogPolyfill.registerDialog(dialogSetTime);
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
    chosenInputText = inputText;
    if (currentTxt === '00:00:00' || currentTxt === '' || currentTxt === undefined) {
        setTimeControls('00', '00', '00');
        enableButtons(false);
    } else
        openSetDialog(currentTxt);
    try {
        addDialogToStack('setTime');
        dialogSetTime.showModal();
    } catch (e) { }
}


function enableButtons(disabled) {
    btnUpS.disabled = disabled;
    btnUpM.disabled = disabled;
    btnUpH.disabled = disabled;
}

$('#btnUpS').on('mousedown touchstart', function () {
    if (parseInt(txtS.value) > 0)
        i = parseInt(txtS.value);
    timeOutS = setInterval(function () {
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
                    i = 0;
                    clearInterval(timeOutS);
                } else {
                    txtM.value = 0;
                    txtH.value = `${h < 10 ? '0' : ''}${h}`;
                }
            }
        }
    }, 100);
}).bind('mouseup mouseleave touchend', function () {
    i = 0;
    clearInterval(timeOutS);
}).bind('click', function () {
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
                i = 0;
                clearInterval(timeOutS);
            } else {
                txtM.value = 0;
                txtH.value = `${h < 10 ? '0' : ''}${h}`;
            }
        }
    }
});

$('#btnDownS').on('mousedown touchstart', function (e) {
    enableButtons(false);
    if (parseInt(txtS.value) > 0)
        i = parseInt(txtS.value);
    timeOutS = setInterval(function () {
        i--;
        if (i >= 0)
            txtS.value = `${i < 10 ? '0' : ''}${i}`;
        else {
            i = 0;
            clearInterval(timeOutS);
        }
    }, 100);
}).bind('mouseup mouseleave touchend', function () {
    i = 0;
    clearInterval(timeOutS);
}).bind('click', function () {
    enableButtons(false);
    if (parseInt(txtS.value) > 0)
        i = parseInt(txtS.value);
    i--;
    if (i >= 0)
        txtS.value = `${i < 10 ? '0' : ''}${i}`;
    else {
        i = 0;
        clearInterval(timeOutS);
    }
});

$('#btnDownM').on('mousedown touchstart', function (e) {
    enableButtons(false);
    if (parseInt(txtM.value) >= 0)
        j = parseInt(txtM.value);
    timeOutM = setInterval(function () {
        j--;
        if (j >= 0)
            txtM.value = `${j < 10 ? '0' : ''}${j}`;
        else {
            j = 0;
            clearInterval(timeOutM);
        }
    }, 100);
}).bind('mouseup mouseleave touchend', function () {
    j = 0;
    clearInterval(timeOutM);
}).bind('click', function () {
    enableButtons(false);
    if (parseInt(txtM.value) > 0)
        j = parseInt(txtM.value);
    j--;
    if (j >= 0)
        txtM.value = `${j < 10 ? '0' : ''}${j}`;
    else {
        j = 0;
        clearInterval(timeOutM);
    }
});

$('#btnDownH').on('mousedown touchstart', function () {
    enableButtons(false);
    if (parseInt(txtH.value) > 0)
        k = parseInt(txtH.value);
    timeOutH = setInterval(function () {
        k--;
        if (k >= 0)
            txtH.value = `${k < 10 ? '0' : ''}${k}`;
        else {
            k = 0;
            clearInterval(timeOutH);
        }
    }, 100);
}).bind('mouseup mouseleave touchend', function () {
    k = 0;
    clearInterval(timeOutH);
}).bind('click', function () {
    enableButtons(false);
    if (parseInt(txtH.value) > 0)
        k = parseInt(txtH.value);
    k--;
    if (k >= 0)
        txtH.value = `${k < 10 ? '0' : ''}${k}`;
    else {
        k = 0;
        clearInterval(timeOutH);
    }
});

$('#btnUpM').on('mousedown touchstart', function () {
    if (parseInt(txtM.value) > 0)
        j = parseInt(txtM.value);
    timeOutM = setInterval(function () {
        j++;
        if (j < 60)
            txtM.value = `${j < 10 ? '0' : ''}${j}`;
        else {
            j = 0;
            let h = parseInt(txtH.value) + 1;
            if (h === 100) {
                setTimeControls('99', '59', '59');
                enableButtons(true);
                j = 0;
                clearInterval(timeOutM);
            } else {
                txtM.value = 0;
                txtH.value = `${h < 10 ? '0' : ''}${h}`;
            }
        }
    }, 100);
}).bind('mouseup mouseleave touchend', function () {
    j = 0;
    clearInterval(timeOutM);
}).bind('click', function () {
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
            j = 0;
            clearInterval(timeOutM);
        } else {
            txtM.value = 0;
            txtH.value = `${h < 10 ? '0' : ''}${h}`;
        }
    }
});

$('#btnUpH').on('mousedown touchstart', function () {
    if (parseInt(txtH.value) > 0)
        k = parseInt(txtH.value);
    timeOutH = setInterval(function () {
        k++;
        if (k === 100) {
            setTimeControls('99', '59', '59');
            enableButtons(true);
            k = 0;
            clearInterval(timeOutH);
        } else
            txtH.value = `${k < 10 ? '0' : ''}${k}`;
    }, 100);
}).bind('mouseup mouseleave touchend', function () {
    k = 0;
    clearInterval(timeOutH);
}).bind('click', function () {
    if (parseInt(txtH.value) > 0)
        k = parseInt(txtH.value);
    k++;
    if (k === 100) {
        setTimeControls('99', '59', '59');
        enableButtons(true);
        k = 0;
        clearInterval(timeOutH);
    } else
        txtH.value = `${k < 10 ? '0' : ''}${k}`;
});