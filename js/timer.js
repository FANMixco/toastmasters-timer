//circle ends
const displayOutput = document.querySelector('.display-remain-time'),
    btnPause = document.getElementById('pause'),
    btnRestart = document.getElementById('btnRestart'),
    btnStop = document.getElementById('btnStop'),
    btnTimeTable = document.getElementById('btnTimetable'),
    btnChampion = document.getElementById('btnChampion'),
    btnBeep = document.getElementById('btnBeep'),
    btnVibrate = document.getElementById('btnVibrate'),
    btnClap = document.getElementById('btnClap'),
    btnDelete = document.getElementById('btnDelete'),
    btnInvert = document.getElementById('btnInvert'),
    btnMultiple = document.getElementById('btnMultiple'),
    btnEmail = document.getElementById('btnEmail'),
    btnShare = document.getElementById('btnShare'),
    btnDownload = document.getElementById('btnDownload'),
    btnYesChallenge = document.getElementById('btnYesChallenge'),
    btnYesConfirm = document.getElementById('btnYesConfirm'),
    btnYesChanges = document.getElementById('btnYesChanges'),
    btnSave = document.getElementById('btnSave'),
    btnSaveClap = document.getElementById('btnSaveClap'),
    btnAbout = document.getElementById('btnAbout'),
    imgClap = document.getElementById('imgClap'),
    dialogTimeTable = document.getElementById('timeTable'),
    dialogWelcome = document.getElementById('welcomeDialog'),
    dialogConfirm = document.getElementById('confirmDialog'),
    dialogCustomTimes = document.getElementById('customTimes'),
    dialogChanges = document.getElementById('changesDialog'),
    dialogAbout = document.getElementById('aboutDialog'),
    dialogClapping = document.getElementById('clappingDialog'),
    txtSpeaker = document.getElementById('txtSpeaker'),
    minH = document.getElementById('minH'),
    minM = document.getElementById('minM'),
    minS = document.getElementById('minS'),
    avgH = document.getElementById('avgH'),
    avgM = document.getElementById('avgM'),
    avgS = document.getElementById('avgS'),
    maxH = document.getElementById('maxH'),
    maxM = document.getElementById('maxM'),
    maxS = document.getElementById('maxS'),
    clapM = document.getElementById('clapM'),
    clapS = document.getElementById('clapS'),
    cmbSpeechType = document.getElementById('cmbSpeechType'),
    remainTime = document.getElementById('remainTime'),
    titleMeeting = document.getElementById('titleMeeting'),
    divSpeaker = document.getElementById('divSpeaker'),
    snackbarMsg = document.getElementById('snackbarMsg');

let clappingTime = 30,
    wholeTime = 30,
    selected = -1,
    minimum = 0,
    average = 0,
    maximum = 0,
    selectedColor = 0,
    green = 0,
    yellow = 0,
    red = 0,
    count = 0;

let elements = new Map();

let isPaused = false,
    isStarted = false,
    isBeepEnabled = false,
    isVibrateEnabled = false,
    isClappingEnabled = false,
    isContestMode = false,
    isCustom = false,
    isFirstRun = true,
    clappingStarted = false,
    multipleEnabled = false;

let dateFormat = "DD/MM/YYYY",
    latestDB = "1.0",
    currentDB = "1.0",
    lastColor = "white";

let countries = ["US", "FM", "MH", "PH"],
    bgColors = ["white", "black"];

let times = [
    //QA (30s)
    [10, 20, 30],
    //Ice-breaker
    [240, 300, 360],
    //1-9 (5 to 7)
    [300, 360, 420],
    //10 (8 to 10)
    [480, 540, 600],
    //Evaluator intro
    [60, 75, 90],
    //Evaluator
    [120, 150, 180],
    //General Evaluator
    [300, 330, 360],
    //TT
    [60, 90, 120],
    //12m
    [600, 660, 720],
    //15m
    [780, 840, 900],
    //20m
    [1080, 1170, 1200]
];

//circle start
let progressBar = document.querySelector('.e-c-progress'),
    indicator = document.getElementById('e-indicator'),
    pointer = document.getElementById('e-pointer'),
    length = Math.PI * 2 * 100;

let intervalTimer;
let timeLeft;

var results = [];

progressBar.style.strokeDasharray = length;

function update(value, timePercent) {
    var offset = -length - length * value / (timePercent);
    if (value >= 0) {
        progressBar.style.strokeDashoffset = -offset;
        pointer.style.transform = `rotate(${360 * value / (-timePercent)}deg)`;
    }
};

update(wholeTime, wholeTime); //refreshes progress bar
displayTimeLeft(wholeTime);

checkMode();

function setDateFormat() {
    if (countries.includes(navigator.language.split('-')[1]))
        dateFormat = "MM/DD/YYYY";
}

function getTimeStamp(seconds) {
    return moment.utc(seconds * 1000).format('HH:mm:ss');
}

function getTime() {
    return remainTime.innerHTML;
}

function checkMode() {
    if (isContestMode) {
        document.getElementById('remainTime').classList.remove('showTime');
        document.getElementById('controls').classList.remove('contestModeOff');
        document.getElementById('remainTime').classList.add('hideTime');
        document.getElementById('controls').classList.add('contestMode');
    } else {
        document.getElementById('remainTime').classList.remove('contestMode');
        document.getElementById('controls').classList.remove('hideTime');
        document.getElementById('remainTime').classList.add('showTime');
        document.getElementById('controls').classList.add('contestModeOff');
    }
}

function changeWholeTime(seconds) {
    if ((wholeTime + seconds) > 0) {
        wholeTime += seconds;
        update(wholeTime, wholeTime);
    }
}

setInitialValues();

function setInitialValues() {
    maximum = 30;
    wholeTime = 30;

    isPaused = false;
    isStarted = false;
    update(wholeTime, wholeTime); //refreshes progress bar
    displayTimeLeft(wholeTime);
}

function updateDisplay() {
    update(wholeTime, wholeTime); //refreshes progress bar
    displayTimeLeft(wholeTime);
}

function basicReset() {
    resetState();
    wholeTime = 30; // manage this to set the whole time    
    updateDisplay();
}

function resetState() {
    isStarted = false;
    btnPause.classList.remove('pause');
    btnPause.classList.add('play');
    clearInterval(intervalTimer);
    wholeTime = -1;
    displayTimeLeft(wholeTime);
    wholeTime = 0;
    displayTimeLeft(wholeTime);
    lastColor = bgColors[selectedColor];
    document.body.style.background = lastColor;
    clappingStarted = false;
    setInitialValues();
    txtSpeaker.value = "";
    divSpeaker.className = 'mdl-textfield mdl-js-textfield';
    btnInvert.disabled = false;
    btnRestart.disabled = false;
    cmbSpeechType.disabled = false;
    btnRestart.innerHTML = "<span class='mdi mdi-restart'></span>";
}

function timer(seconds) { //counts time, takes seconds
    if (seconds === undefined)
        seconds = maximum;
    let remainTime = Date.now() + (seconds * 1000);
    displayTimeLeft(seconds);

    intervalTimer = setInterval(function() {
        timeLeft = Math.round((remainTime - Date.now()) / 1000);
        let counter = maximum - timeLeft;
        if (counter >= minimum && counter < average) {
            green++;
            document.body.style.background = "#60ad5e";
            startBeep();
            startVibrate();
            lastColor = "green";
        } else if (counter >= average && counter < maximum) {
            yellow++;
            document.body.style.background = "#ffeb3b";
            startBeep();
            startVibrate();
            lastColor = "yellow";
        } else if (counter >= maximum) {
            red++;
            document.body.style.background = "#e53935";
            startBeep();
            startVibrate();
            lastColor = "red";
        }
        if (counter >= maximum + clappingTime) {
            if (!clappingStarted)
                startClapping();
            clappingStarted = true;
        }
        displayTimeLeft(timeLeft);
    }, 1000);
}

window.onresize = function(event) {
    resizeScreen();
};

function resizeScreen() {
    let scaleVal = window.innerHeight / 600;
    if (window.innerHeight < 514) {
        $('body').prepend($('<div id="externalContainer"></div>'));
        $('#externalContainer').append($('#superContainer'));
        $('#externalContainer').css("height", `${window.innerHeight}px`);

        $('#superContainer').css("transform-origin", "50% 0% 0px");

        setTimeout(function() {
            $('#superContainer').css("transform", `scale(${scaleVal}`);
            setTimeout(function() {
                let cHeight = (1 + scaleVal) * window.innerHeight;
                if (cHeight < 514)
                    cHeight = 514;
                $('#superContainer').css("height", `${cHeight}px`);
            }, 100);
        }, 100);
    } else {
        $('#superContainer').css("height", `${window.innerHeight}px`);
        $('#superContainer').css("transform-origin", "50% 0% 0px");

        setTimeout(function() {
            $('#superContainer').css("transform", `scale(${scaleVal}`);
        }, 100);

        setTimeout(function() {
            if ($(".mdl-textfield__input")[0].getBoundingClientRect().width > $('body').outerWidth()) {
                $('#superContainer').css("transform", `scale(${scaleVal - (scaleVal - $(".mdl-textfield__input")[0].getBoundingClientRect().width / $('body').outerWidth())}`);
            }
        }, 100);
    }
}

function pauseTimer(event) {
    if (minimum === 0 && maximum === 0 && average === 0) {
        if (isCustom)
            showSnackbar(lngObject.notSaved);
        else
            showSnackbar(lngObject.chooseTime);
        return;
    }

    btnInvert.disabled = true;
    cmbSpeechType.disabled = true;

    if (isStarted === false) {
        timer(wholeTime);
        isStarted = true;
        this.classList.remove('play');
        this.classList.add('pause');
    } else if (isPaused) {
        this.classList.remove('play');
        this.classList.add('pause');
        timer(timeLeft);
        isPaused = isPaused ? false : true
    } else {
        this.classList.remove('pause');
        this.classList.add('play');
        clearInterval(intervalTimer);
        isPaused = isPaused ? false : true;
    }

    btnRestart.disabled = !isPaused;

    if (btnRestart.disabled) {
        btnRestart.innerHTML = "<span class='mdi mdi-restart-off'></span>";
        $('footer,#divSpeechType,#options,#divSpeaker').fadeTo("fast", '0.1');
    } else {
        btnRestart.innerHTML = "<span class='mdi mdi-restart'></span>";
        $('footer,#divSpeechType,#options,#divSpeaker').fadeTo("fast", '1');
    }
}

function displayTimeLeft(timeLeft) { //displays time on the input
    let fixedTime = maximum - timeLeft;
    let hours = Math.floor(fixedTime / 3600);
    let minutes = Math.floor(fixedTime / 60);
    let seconds = fixedTime % 60;
    let displayString = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    displayOutput.textContent = displayString;
    update(timeLeft, wholeTime);
}

function setDropDownValue(idVal, idContainer) {
    try {
        $(idVal).attr("data-selected", "true");
        getmdlSelect.init(idContainer);
    } catch (e) {}
}

function changeEventHandler(event) {
    let wasCustom = selected == "11";

    selected = hiddenSpeechType.value;

    if (parseInt(selected) != 11) {
        minimum = times[selected][0];
        average = times[selected][1];
        maximum = times[selected][2];

        wholeTime = maximum;
        update(wholeTime, wholeTime); //refreshes progress bar
        displayTimeLeft(wholeTime);
    } else {
        if (!wasCustom) {
            minimum = 0;
            maximum = 0;
            average = 0;

            setDropDownValue("#minH0", "#divMinH");
            setDropDownValue("#minM0", "#divMinM");
            setDropDownValue("#minS0", "#divMinS");

            setDropDownValue("#avgH0", "#divAvgH");
            setDropDownValue("#avgM0", "#divAvgM");
            setDropDownValue("#avgS0", "#divAvgS");

            setDropDownValue("#maxH0", "#divMaxH");
            setDropDownValue("#maxM0", "#divMaxM");
            setDropDownValue("#maxS0", "#divMaxS");
        }

        isCustom = true;
        dialogCustomTimes.showModal();
    }
}

function startBeep() {
    if (isBeepEnabled && (green === 1 || yellow === 1 || red === 1))
        browserStartBeep();
    //CSharp.Beep();
}

function startVibrate() {
    if (isVibrateEnabled && (green === 1 || yellow === 1 || red === 1))
        browserStartVibrate();
    //CSharp.Vibrate();
}

function startClapping() {
    if (isClappingEnabled)
        browserStartClapping();
    //CSharp.StartClapping();
}

function stopClapping() {
    browserStopClapping();
    //CSharp.StopClapping();
}

function getVibrate() {
    if (getLocalStorageValue("isVibrateEnabled") !== null)
        isVibrateEnabled = (getLocalStorageValue("isVibrateEnabled") === 'true');
    else
        setVibrate();
}

function getClapping() {
    if (getLocalStorageValue("isClappingEnabled") !== null)
        isClappingEnabled = (getLocalStorageValue("isClappingEnabled") === 'true');
    else
        setClapping();
}

function getBeep() {
    if (getLocalStorageValue("isBeepEnabled") !== null)
        isBeepEnabled = (getLocalStorageValue("isBeepEnabled") === 'true');
    else
        setBeep();
}

function getContestMode() {
    if (getLocalStorageValue("isContestMode") !== null)
        isContestMode = (getLocalStorageValue("isContestMode") === 'true');
    else
        setContestMode();
}

function getFirstRun() {
    if (getLocalStorageValue("isFirstRun") !== null)
        isFirstRun = (getLocalStorageValue("isFirstRun") === 'true');
    else
        setFirstRun();
}

function getSelectedColor() {
    if (getLocalStorageValue("selectedColor") !== null)
        selectedColor = parseInt(getLocalStorageValue("selectedColor"));
    else
        setSelectedColor();
}

function setBeep() {
    setLocalStorage("isBeepEnabled", isBeepEnabled);
}

function setVibrate() {
    setLocalStorage("isVibrateEnabled", isVibrateEnabled);
}

function setClapping() {
    setLocalStorage("isClappingEnabled", isClappingEnabled);
}

function setContestMode() {
    setLocalStorage("isContestMode", isContestMode);
}

function setSelectedColor() {
    setLocalStorage("selectedColor", selectedColor);
}

function setFirstRun() {
    setLocalStorage("isFirstRun", isFirstRun);
}

function setContestImg() {
    if (!isContestMode)
        btnChampion.innerHTML = "<span class='mdi mdi-trophy-broken'></span>";
    else
        btnChampion.innerHTML = "<span class='mdi mdi-trophy'></span>";
}

function setVibrateImg() {
    if (!isVibrateEnabled)
        btnVibrate.innerHTML = "<span class='mdi mdi-vibrate-off'></span>";
    else
        btnVibrate.innerHTML = "<span class='mdi mdi-vibrate'></span>";
}

function setBeepImg() {
    if (!isBeepEnabled)
        btnBeep.innerHTML = "<span class='mdi mdi-volume-off'></span>";
    else
        btnBeep.innerHTML = "<span class='mdi mdi-volume-high'></span>";
}

function setClappingImg() {
    if (!isClappingEnabled)
        imgClap.src = "img/clapping-off.svg";
    else
        imgClap.src = "img/clapping-hands.svg";
}

function invertColors() {
    if (selectedColor === 1)
        $('body').css('filter', 'invert(100%)');
    else
        $('body').css('filter', 'invert(0%)');
    document.body.style.background = lastColor;
}

function storeTime(isTimeStored) {
    if (minimum === 0 && maximum === 0 && average === 0) return;
    stopClapping();

    if (isTimeStored) {
        let counter = maximum - timeLeft;
        addNewTime(txtSpeaker.value, cmbSpeechType.value, getTimeStamp(minimum), getTimeStamp(average), getTimeStamp(maximum), getTimeStamp(counter), lastColor, ((counter > (maximum + clappingTime)) || (counter < (minimum - clappingTime))));
    }

    //Perform the reset before selecting the maximum
    green = 0;
    yellow = 0;
    red = 0;
    basicReset();

    if (!isCustom)
        maximum = times[selected][2];
    else
        maximum = getMaxCustom();

    wholeTime = maximum;
    $('footer,#divSpeechType,#options,#divSpeaker').fadeTo("fast", '1');
}

function getMinCustom() {
    let intMinH = 0,
        intMinM = 0,
        intMinS = 0;

    if (minH.value) intMinH = parseInt(minH.value);
    if (minM.value) intMinM = parseInt(minM.value);
    if (minS.value) intMinS = parseInt(minS.value);

    return intMinH * 3600 + intMinM * 60 + intMinS;
}

function getAvgCustom() {
    let intAvgH = 0,
        intAvgM = 0,
        intAvgS = 0;

    if (avgH.value) intAvgH = parseInt(avgH.value);
    if (avgM.value) intAvgM = parseInt(avgM.value);
    if (avgS.value) intAvgS = parseInt(avgS.value);

    return intAvgH * 3600 + intAvgM * 60 + intAvgS;
}

function getMaxCustom() {
    let intMaxH = 0,
        intMaxM = 0,
        intMaxS = 0;

    if (maxH.value) intMaxH = parseInt(maxH.value);
    if (maxM.value) intMaxM = parseInt(maxM.value);
    if (maxS.value) intMaxS = parseInt(maxS.value);

    return intMaxH * 3600 + intMaxM * 60 + intMaxS;
}

function saveChanges() {
    let minTime = getMinCustom(),
        avgTime = getAvgCustom(),
        maxTime = getMaxCustom();

    if (minTime >= avgTime)
        showSnackbar(lngObject.errorMin);
    else if (minTime >= maxTime)
        showSnackbar(lngObject.errorHalf);
    else if (avgTime >= maxTime)
        showSnackbar(lngObject.errorMax);
    else {
        minimum = minTime;
        average = avgTime;
        maximum = maxTime;
        wholeTime = maximum;
        dialogCustomTimes.close();
    }
}

function resizeSelect() {
    setTimeout(function() {
        $($(".mdl-menu__outline")[0]).width(300);
        $($(".mdl-menu__container")[0]).width(300);
        $($(".mdl-menu__outline")[0]).height(310);
        $($(".mdl-menu__container")[0]).height(310);
        var res = $($('.mdl-menu')[0]).css('clip').split(", ");
        res[1] = res[1].replace("px", "");
        res[2] = res[2].replace("px", "");
        $($('.mdl-menu')[0]).css('clip', `${res[0]}, 300px, 300px, ${res[3]}`);
    }, 50);    
}

btnPause.addEventListener('click', pauseTimer);

btnRestart.addEventListener('click', event => {
    storeTime(false);
});

btnStop.addEventListener('click', event => {
    storeTime(true);
});

btnChampion.addEventListener('click', event => {
    isContestMode = !isContestMode;
    setContestImg();
    checkMode();
    setContestMode();
});

btnVibrate.addEventListener('click', event => {
    isVibrateEnabled = !isVibrateEnabled;
    setVibrateImg();
    setVibrate();
});

btnBeep.addEventListener('click', event => {
    isBeepEnabled = !isBeepEnabled;
    setBeepImg();
    setBeep();
});

btnClap.addEventListener('click', function(event) {
    let countdown;

    function reset() {
        count = 0;
        countdown = null;
    }

    count++;

    if (count === 3) {
        if (!elements.has(event.target)) {
            elements.set(event.target, 1);
        } else {
            let currentCount = elements.get(event.target);
            currentCount++;
            elements.set(event.target, currentCount);
        }

        let tripleClick = new CustomEvent('trplclick', {
            bubbles: true,
            detail: {
                numberOfTripleClicks: elements.get(event.target)
            }
        });

        event.target.dispatchEvent(tripleClick);
        reset();
    } else {
        isClappingEnabled = !isClappingEnabled;
        setClappingImg();
        setClapping();

    }

    if (!countdown) {
        countdown = window.setTimeout(function() {
            reset();
        }, 500);
    }
});

btnClap.addEventListener('trplclick', function(event) {
    dialogClapping.showModal();
    setDropDownValue("#clapM0", "#divClapM");
    setDropDownValue("#clapS30", "#divClapS");
    return false;
});

btnSave.addEventListener('click', saveChanges);

btnSaveClap.addEventListener('click', event => {
    clappingTime = getSeconds(`00:${clapM.value}:${clapS.value}`);
    dialogClapping.close();
});

if (!dialogTimeTable.showModal) {
    dialogPolyfill.registerDialog(dialogTimeTable);
}

if (!dialogChanges.showModal) {
    dialogPolyfill.registerDialog(dialogChanges);
}

if (!dialogAbout.showModal) {
    dialogPolyfill.registerDialog(dialogAbout);
}

if (!dialogClapping.showModal) {
    dialogPolyfill.registerDialog(dialogClapping);
}

if (!dialogCustomTimes.showModal) {
    dialogPolyfill.registerDialog(dialogCustomTimes);
}

if (!dialogWelcome.showModal) {
    dialogPolyfill.registerDialog(dialogWelcome);
}

if (!dialogConfirm.showModal) {
    dialogPolyfill.registerDialog(dialogConfirm);
}

btnTimeTable.addEventListener('click', countTimetable);

btnDelete.addEventListener('click', deleteTimetable);

btnYesChallenge.addEventListener('click', function() {
    isContestMode = true;
    setContestImg();
    checkMode();
    setContestMode();
    dialogWelcome.close();
    isFirstRun = false;
    setFirstRun();
});

btnYesConfirm.addEventListener('click', deleteByIDs);

btnInvert.addEventListener('click', function() {
    if (selectedColor === 0)
        selectedColor = 1;
    else
        selectedColor = 0;
    lastColor = bgColors[selectedColor];
    setSelectedColor();
    invertColors();
});

btnYesChanges.addEventListener('click', function() {
    saveChanges();
    dialogChanges.close();
});

btnShare.addEventListener('click', function() {});

btnEmail.addEventListener('click', function() {});

btnAbout.addEventListener('click', function() {
    dialogAbout.showModal();
});

btnDownload.addEventListener('click', browserExport);

btnMultiple.addEventListener('click', function() {
    $(".mdl-js-checkbox").each(function() {
        let _this = this;
        setTimeout(function() {
            _this.MaterialCheckbox.check();
        }, 10);
    });
    if (!multipleEnabled) {
        btnMultiple.innerHTML = "<span class='mdi mdi-checkbox-blank-outline'></span>";
        $(".tdDel,#thDel").show();
    } else {
        btnMultiple.innerHTML = "<span class='mdi mdi-check-box-outline'></span>";
        $(".tdDel,#thDel").hide();
    }
    multipleEnabled = !multipleEnabled;
});

dialogTimeTable.querySelector('.close').addEventListener('click', function() {
    dialogTimeTable.close();
});

dialogClapping.querySelector('.close').addEventListener('click', function() {
    dialogClapping.close();
});

dialogCustomTimes.querySelector('.close').addEventListener('click', function() {
    if (getMinCustom() > 0 || getAvgCustom() > 0 || getMaxCustom() > 0)
        dialogChanges.showModal();
    else
        dialogCustomTimes.close();
});

dialogConfirm.querySelector('.close').addEventListener('click', function() {
    dialogConfirm.close();
});

dialogAbout.querySelector('.close').addEventListener('click', function() {
    dialogAbout.close();
});

dialogChanges.querySelector('.close').addEventListener('click', function() {
    dialogChanges.close();
    dialogCustomTimes.close();
});

dialogWelcome.querySelector('.close').addEventListener('click', function() {
    dialogWelcome.close();
    isFirstRun = false;
    setFirstRun();
    showSnackbar(lngObject.noHints);
});

document.addEventListener('DOMContentLoaded', function() {
    cmbSpeechType.onchange = changeEventHandler;
}, false);

cmbSpeechType.addEventListener('click', resizeSelect);

maximum = 0;
wholeTime = 0;

getBeep();
getVibrate();
getClapping();
getContestMode();
getSelectedColor();
getFirstRun();

setContestImg();
setVibrateImg();
setBeepImg();
setClappingImg();
setSelectedColor();

setDateFormat();
initializeDB(currentDB, latestDB);

lastColor = bgColors[selectedColor];
invertColors();

setTimeout(function() {
    if (!(deviceDetector.device == 'desktop' || deviceDetector.device == 'tablet')) {
        $("#timeTable").prepend("<div id='row'><div class='leftTitle'><h4 id='btnCloseMobile' class='mdl-dialog__title'><span class='mdi mdi-close'></span></h4></div><div class='rightTitle'></div></div></div>");

        $(".rightTitle").append($("#titleMeeting"));

        $("#btnCloseMeeting").hide();

        $("#btnCloseMobile").click(function() {
            dialogTimeTable.close();
        });
    }
    titleMeeting.innerHTML = `${lngObject.meetingAt} ${moment((new Date())).format(dateFormat)}`;
}, 100);

if (isFirstRun) {
    dialogWelcome.showModal();
}

checkMode();

$(function() {
    $("#tickAll").change(function() {
        $(".mdl-js-checkbox").not("#lblTickAll").each(function() {
            let _this = this;
            setTimeout(function() {
                if ($("#lblTickAll").is('.is-checked'))
                    _this.MaterialCheckbox.check();
                else
                    _this.MaterialCheckbox.uncheck();
            }, 10);
        });
    });

    $("#txtMember").on('keyup', function(e) {
        if (e.keyCode === 13)
            $(this).hideKeyboard();
    });

    if (deviceDetector.device == 'desktop' || deviceDetector.device == 'tablet') {
        $('#timeTable').addClass('centeredDialog');
        document.getElementById('divSpeakers').style.height = `${document.body.clientHeight * 0.53}px`;
    } else {
        if (window.innerHeight < 514 && window.innerWidth > window.innerHeight)
            document.getElementById('divSpeakers').style.height = `${document.body.clientHeight * 0.53}px`;
        else
            document.getElementById('divSpeakers').style.height = `${document.body.clientHeight * 0.68}px`;

        $('#timeTable').addClass('fullscreen-dialog');
    }

    if (typeof HTMLDialogElement !== 'function') {
        $("#welcomeDialog").removeClass("centeredDialog");
        $("#welcomeDialog").addClass("centeredDialogNoSupport");
    }
    
   $('body').focusin(function() {
       if ($(".mdl-menu__outline").eq(0).css('z-index') != "-1")
            resizeSelect();
   });
});

resizeScreen();

$.fn.hideKeyboard = function() {
    var inputs = this.filter("input").attr("readonly", "readonly"); // Force keyboard to hide on input field.
    setTimeout(function() {
        inputs.blur().removeAttr("readonly"); //actually close the keyboard and remove attributes
    }, 100);
    return this;
};

window.addEventListener('orientationchange', doOnOrientationChange);

function doOnOrientationChange() {
    location.reload();
}