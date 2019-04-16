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
    btnUpH = document.getElementById('btnUpH'),
    btnUpM = document.getElementById('btnUpM'),
    btnUpS = document.getElementById('btnUpS'),
    btnDownH = document.getElementById('btnDownH'),
    btnDownM = document.getElementById('btnDownM'),
    btnDownS = document.getElementById('btnDownS'),
    imgClap = document.getElementById('imgClap'),
    dialogTimeTable = document.getElementById('timeTable'),
    dialogWelcome = document.getElementById('welcomeDialog'),
    dialogConfirm = document.getElementById('confirmDialog'),
    dialogChanges = document.getElementById('changesDialog'),
    dialogCustomTimes = document.getElementById('customTimes'),
    dialogAbout = document.getElementById('aboutDialog'),
    dialogClapping = document.getElementById('clappingDialog'),
    txtSpeaker = document.getElementById('txtSpeaker'),
    txtCustom = document.getElementById('txtCustom'),
    txtMin = document.getElementById('txtMin'),
    txtAvg = document.getElementById('txtAvg'),
    txtMax = document.getElementById('txtMax'),
    clapM = document.getElementById('clapM'),
    clapS = document.getElementById('clapS'),
    cmbSpeechType = document.getElementById('cmbSpeechType'),
    remainTime = document.getElementById('remainTime'),
    titleMeeting = document.getElementById('titleMeeting'),
    divSpeaker = document.getElementById('divSpeaker'),
    snackbarMsg = document.getElementById('snackbarMsg'),
    length = Math.PI * 2 * 100;

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
    timeLeft = 0;

let elements = new Map();

let isPaused = false,
    isStarted = false,
    isStopped = true,
    isBeepEnabled = false,
    isVibrateEnabled = false,
    isClappingEnabled = false,
    isContestMode = false,
    isCustom = false,
    isFirstRun = true,
    clappingStarted = false,
    multipleEnabled = false,
    isNinjaMode = false,
    isFirstTime = false;

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
    [1080, 1170, 1200],
    //1m
    [30, 45, 60]
];

//circle start
let progressBar = document.querySelector('.e-c-progress'),
    indicator = document.getElementById('e-indicator'),
    pointer = document.getElementById('e-pointer');

let intervalTimer;

var results = [];

progressBar.style.strokeDasharray = length;

function update(value, timePercent) {
    var offset = -length - length * value / (timePercent);
    if (value >= 0) {
        progressBar.style.strokeDashoffset = -offset;
        pointer.style.transform = `rotate(${360 * value / (-timePercent)}deg)`;
    }
}

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
    if (wholeTime + seconds > 0) {
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
    isStopped = true;
    isPaused = false;
    btnRestart.innerHTML = "<span class='mdi mdi-restart'></span>";
    timeLeft = 0;
    currentState = 1;
}

function timer(seconds) { //counts time, takes seconds
    let remainTime = Date.now() + seconds * 1000;
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

window.onresize = function() {
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

function pauseTimer() {
    if (minimum === 0 && maximum === 0 && average === 0 || selected === -1) {
        if (isCustom)
            showSnackbar(lngObject.notSaved);
        else
            showSnackbar(lngObject.chooseTime);
        return;
    }
    validateProperIntervals();

    browserStopClapping();

    isStopped = false;

    btnInvert.disabled = true;
    cmbSpeechType.disabled = true;

    if (!isStarted || timeLeft === undefined) {
        timer(wholeTime);
        isStarted = true;
        btnPause.classList.remove('play');
        btnPause.classList.add('pause');
    } else if (isPaused) {
        btnPause.classList.remove('play');
        btnPause.classList.add('pause');
        timer(timeLeft);
        isPaused = isPaused ? false : true;
    } else {
        btnPause.classList.remove('pause');
        btnPause.classList.add('play');
        clearInterval(intervalTimer);
        isPaused = isPaused ? false : true;
    }

    btnRestart.disabled = !isPaused;

    if (btnRestart.disabled) {
        btnRestart.innerHTML = "<span class='mdi mdi-restart-off'></span>";
        $('footer,#divSpeechType,#options,#divSpeaker').fadeTo("fast", '0.1');

        if (isNinjaMode) {
            $('.circle').fadeTo("fast", '0');
            $('#controls').fadeTo("fast", '0.5');
        }
    } else {
        btnRestart.innerHTML = "<span class='mdi mdi-restart'></span>";
        $('footer,#divSpeechType,#options,#divSpeaker,.circle,#controls').fadeTo("fast", '1');
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

function validateProperIntervals() {
    if (isCustom) {
        minimum = getMinCustom();
        average = getAvgCustom();
        maximum = getMaxCustom();
    } else
        setBasicIntervals();
    if (timeLeft === 0)
        wholeTime = maximum;
}

function setBasicIntervals() {
    let selectedVal = selected;
    if (selected > 11) selectedVal--;
    minimum = times[selectedVal][0];
    average = times[selectedVal][1];
    maximum = times[selectedVal][2];
}

function changeEventHandler() {
    let wasCustom = selected === 11;

    selected = parseInt(hiddenSpeechType.value);

    if (selected !== 11) {
        setBasicIntervals();

        wholeTime = maximum;
        updateDisplay();
        isCustom = false;
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
            $("#txtCustom")[0].parentElement.MaterialTextfield.change(lngObject.opt12);
        } else if (wasCustom && !isFirstTime) {
            $("#txtCustom")[0].parentElement.MaterialTextfield.change(getLocalStorageValue("txtCustom"));
            let hours = Math.floor(minimum / 3600);
            let minutes = Math.floor(minimum / 60);
            let seconds = minimum % 60;

            setDropDownValue(`#minH${hours}`, "#divMinH");
            setDropDownValue(`#minM${minutes}`, "#divMinM");
            setDropDownValue(`#minS${seconds}`, "#divMinS");

            hours = Math.floor(average / 3600);
            minutes = Math.floor(average / 60);
            seconds = average % 60;

            setDropDownValue(`#avgH${hours}`, "#divAvgH");
            setDropDownValue(`#avgM${minutes}`, "#divAvgM");
            setDropDownValue(`#avgS${seconds}`, "#divAvgS");

            hours = Math.floor(maximum / 3600);
            minutes = Math.floor(maximum / 60);
            seconds = maximum % 60;

            setDropDownValue(`#maxH${hours}`, "#divMaxH");
            setDropDownValue(`#maxM${minutes}`, "#divMaxM");
            setDropDownValue(`#maxS${seconds}`, "#divMaxS");
        }
        
        if (!(deviceDetector.device === 'desktop' || deviceDetector.device === 'tablet')) {
            setTimeout(function () {
                $('#bodyCustomTimes').css({
                    'height': `${($('#bodyCustomTimes').height() * 100) / $('html').height()}%`
                });
            }, 100);
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
        isVibrateEnabled = getLocalStorageValue("isVibrateEnabled") === 'true';
    else
        setVibrate();
}

function getClapping() {
    if (getLocalStorageValue("isClappingEnabled") !== null)
        isClappingEnabled = getLocalStorageValue("isClappingEnabled") === 'true';
    else
        setClapping();
}

function getBeep() {
    if (getLocalStorageValue("isBeepEnabled") !== null)
        isBeepEnabled = getLocalStorageValue("isBeepEnabled") === 'true';
    else
        setBeep();
}

function getContestMode() {
    if (getLocalStorageValue("isContestMode") !== null)
        isContestMode = getLocalStorageValue("isContestMode") === 'true';
    else
        setContestMode();
}

function getFirstRun() {
    if (getLocalStorageValue("isFirstRun") !== null)
        isFirstRun = getLocalStorageValue("isFirstRun") === 'true';
    else
        setFirstRun();
}

function getNinjaMode() {
    if (getLocalStorageValue("isNinjaMode") !== null)
        isNinjaMode = getLocalStorageValue("isNinjaMode") === 'true';
    else
        setLocalStorage("isNinjaMode", false);
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
        let titleSpeechType = cmbSpeechType.value;
        if (selected === 11)
            titleSpeechType = txtCustom.value;
        addNewTime(txtSpeaker.value, titleSpeechType, getTimeStamp(minimum), getTimeStamp(average), getTimeStamp(maximum), getTimeStamp(counter), lastColor, counter > maximum + clappingTime || counter < minimum - clappingTime);
    }

    //Perform the reset before selecting the maximum
    green = 0;
    yellow = 0;
    red = 0;
    basicReset();

    if (!isCustom) {
        let selectedVal = selected;
        if (selected > 11) selectedVal--;
        maximum = times[selectedVal][2];
    } else
        maximum = getMaxCustom();

    wholeTime = maximum;
    $('footer,#divSpeechType,#options,#divSpeaker,.circle,#controls').fadeTo("fast", '1');
}

function getMinCustom() {
    let unit = txtMin.value.split(":");
    return parseInt(unit[0]) * 3600 + parseInt(unit[1]) * 60 + parseInt(unit[2]);
}

function getAvgCustom() {
    let unit = txtAvg.value.split(":");
    return parseInt(unit[0]) * 3600 + parseInt(unit[1]) * 60 + parseInt(unit[2]);
}

function getMaxCustom() {
    let unit = txtMax.value.split(":");
    return parseInt(unit[0]) * 3600 + parseInt(unit[1]) * 60 + parseInt(unit[2]);
}

function closeCustomDialog() {
    if (getMinCustom() > 0 || getAvgCustom() > 0 || getMaxCustom() > 0)
        dialogChanges.showModal();
    else
        dialogCustomTimes.close();
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
        updateDisplay();
        dialogCustomTimes.close();
    }
}

btnPause.addEventListener('click', function(event) {
    if (event.detail === 1)
        pauseTimer();
});

btnRestart.addEventListener('click', () => {
    storeTime(false);
});

btnStop.addEventListener('click', () => {
    storeTime(true);
});

btnChampion.addEventListener('click', function(event) {
    if (event.detail === 3) {
        isNinjaMode = !isNinjaMode;

        if (isNinjaMode)
            showSnackbar(lngObject.ninjaEnabled, false);
        else
            showSnackbar(lngObject.ninjaDisabled, false);
        setLocalStorage("isNinjaMode", isNinjaMode);
    } else {
        isContestMode = !isContestMode;
        setContestImg();
        checkMode();
        setContestMode();
    }
});

btnVibrate.addEventListener('click', () => {
    isVibrateEnabled = !isVibrateEnabled;
    setVibrateImg();
    setVibrate();
});

btnBeep.addEventListener('click', () => {
    isBeepEnabled = !isBeepEnabled;
    setBeepImg();
    setBeep();
});

btnClap.addEventListener('click', function(event) {
    if (event.detail === 3) {
        dialogClapping.showModal();
        if (clappingTime === 30) {
            setDropDownValue("#clapM0", "#divClapM");
            setDropDownValue("#clapS30", "#divClapS");
        }
    } else {
        isClappingEnabled = !isClappingEnabled;
        setClappingImg();
        setClapping();
    }
});

btnSave.addEventListener('click', saveChanges);

btnSaveClap.addEventListener('click', () => {
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
    if (!(deviceDetector.device === 'desktop' || deviceDetector.device === 'tablet')) {
		setTimeout(function(){
			$('#bodyAbout').css({
				 'height': `${($('#bodyAbout').height() * 100) / $('html').height()}%`
			});
		}, 100);
	}
});

txtMin.addEventListener('click', function() {
    setNewTime('txtMin', txtMin.value);
});

txtMax.addEventListener('click', function() {
    setNewTime('txtMax', txtMax.value);
});

txtAvg.addEventListener('click', function() {
    setNewTime('txtAvg', txtAvg.value);
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
    refreshControls();
});

dialogTimeTable.querySelector('.close').addEventListener('click', function() {
    dialogTimeTable.close();
});

dialogCustomTimes.querySelector('.close').addEventListener('click', closeCustomDialog);

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

txtCustom.addEventListener("keyup", function(e) {
    if (e.keyCode === 13)
        $("#txtCustom").hideKeyboard();
});

txtSpeaker.addEventListener("keyup", function(e) {
    if (e.keyCode === 13)
        $("#txtSpeaker").hideKeyboard();
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
getNinjaMode();
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
        $("#timeTable").prepend(`<div class='titleContainer'><div class='titleInnerContainer'><span class='closeMobile' id='btnCloseMobile'><span class='mdi mdi-close'></span></span><span id='spanTitle'></span></div></div>`);

        $("#titleMeeting").removeClass('mdl-dialog__title');
        $("#titleMeeting").css({
            'margin': '0',
            'margin-top': '16px',
            'font-weight': '1000',
            'font-size': '1.25em',
            'display': 'inline'
        });

        $("#spanTitle").append($("#titleMeeting"));

        $("#btnCloseMeeting").hide();

        $("#btnCloseMobile").click(function() {
            dialogTimeTable.close();
        });

        $("#customTimes").prepend(`<div class='titleContainer'><div class='titleInnerContainer'><span class='closeMobile' id='btnCloseMobileCustom'><span class='mdi mdi-close'></span></span><span id='spanTitleCustom'><h4 id='customTitle'>&nbsp;</h4></span><span id='spanSave'></span></div></div>`);

        $("#customTitle").css({
            'margin': '0',
            'margin-top': '16px',
            'font-weight': '1000',
            'font-size': '1.25em',
            'display': 'inline'
        });

        $("#btnCloseMobileCustom").click(function() {
            closeCustomDialog();
        });

        $("#spanSave").append($("#btnSave"));

        $("#btnCloseCustom,#footerCustom").hide();

        $("#aboutDialog").prepend(`<div class='titleContainer'><div class='titleInnerContainer'><span class='closeMobile' id='btnCloseMobileAbout'><span class='mdi mdi-close'></span></span><span id='spanTitleAbout'></span></div></div>`);

        $("#titleAbout").removeClass('mdl-dialog__title');
        $("#titleAbout").css({
            'margin': '0',
            'margin-top': '16px',
            'font-weight': '1000',
            'font-size': '1.25em',
            'display': 'inline'
        });

        $("#spanTitleAbout").append($("#titleAbout"));

        $("#btnCloseMobileAbout").click(function() {
            dialogAbout.close();
        });

        $("#divCloseAbout").hide();
    }
    titleMeeting.innerHTML = `${lngObject.meetingAt} ${moment().format(dateFormat)}`;
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
        refreshControls();
    });
    
    btnShare.style.visibility = 'hidden';
    btnEmail.style.visibility = 'hidden';
    isFirstTime = true;

    if (deviceDetector.device === 'desktop' || deviceDetector.device === 'tablet') {
        $('#timeTable').addClass('centeredDialog');
        $('#timeTable').addClass('fullscreen-dialog-tablet');
        $('#aboutDialog').addClass('fullscreen-dialog-tablet');
        document.getElementById('divSpeakers').style.height = `${document.body.clientHeight * 0.53}px`;
    } else {
        $('#bodyCustomTimes').addClass('customBodyMobile');
        if (window.innerHeight < 514 && window.innerWidth > window.innerHeight)
            document.getElementById('divSpeakers').style.height = `${document.body.clientHeight * 0.60}px`;
        else
            document.getElementById('divSpeakers').style.height = `${document.body.clientHeight * 0.75}px`;

        $('#timeTable').addClass('fullscreen-dialog');
        $('#customTimes').addClass('fullscreen-dialog');
        $('#aboutDialog').addClass('fullscreen-dialog');
    }

    if (typeof HTMLDialogElement !== 'function') {
        $("#welcomeDialog").removeClass("centeredDialog");
        $("#welcomeDialog").addClass("centeredDialogNoSupport");
    }

    $('body').focus(function() {
        if ($(".mdl-menu__outline").eq(0).css('z-index') !== "-1")
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
