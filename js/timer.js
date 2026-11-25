//Controls
const displayOutput = document.querySelector('.display-remain-time'),
    externalLinks = document.getElementsByClassName('externalLinks'),
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
    btnSponsor2Us = document.getElementById('btnSponsor2Us'),
    btnSave = document.getElementById('btnSave'),
    btnSaveClap = document.getElementById('btnSaveClap'),
    btnAbout = document.getElementById('btnAbout'),
    imgClap = document.getElementById('imgClap'),
    imgRestart = document.getElementById('imgRestart'),
    imgTrophy = document.getElementById('imgTrophy'),
    imgBeep = document.getElementById('imgBeep'),
    imgCheckBox = document.getElementById('imgCheckBox'),
    imgMultiple = document.getElementById('imgMultiple'),
    imgVibrate = document.getElementById('imgVibrate'),
    dialogTimeTable = document.getElementById('timeTable'),
    dialogWelcome = document.getElementById('welcomeDialog'),
    dialogConfirm = document.getElementById('confirmDialog'),
    dialogChanges = document.getElementById('changesDialog'),
    dialogCustomTimes = document.getElementById('customTimes'),
    dialogEasterEgg = document.getElementById('easterEggDialog'),
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
    btnEditCustom = document.getElementById('btnEditCustom'),
    remainTime = document.getElementById('remainTime'),
    tickAll = document.getElementById('tickAll'),
    progressBar = document.querySelector('.e-c-progress'),
    indicator = document.getElementById('e-indicator'),
    pointer = document.getElementById('e-pointer'),
    speakers = document.getElementById('speakers'),
    ddLang = document.getElementById('ddLang'),
    invert100 = "invert(100%)",
    invert0 = "invert(0%)",
    length = Math.PI * 2 * 100,
    fastTransition = 0.2;

const defGreenBgn = "#60ad5e",
    defYellowBgn = "#ffeb3b",
    defRedBgn = "#e53935",
    defGreenCBBgn = "#2196f3",
    defYellowCBBgn = "#ffeb3b",
    defRedCBBgn = "#ad1457";

let greenBgnCss = defGreenBgn,
    yellowBgnCss = defYellowBgn,
    redBgnCss = defRedBgn;

// Detects if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

const titleMeeting = document.getElementById('titleMeeting');

let clappingTime = 30,
    wholeTime = 30,
    selected = -1,
    minimum = 0,
    average = 0,
    maximum = 0,
    selectedColor = isDarkModeEnabled(),
    green = 0,
    yellow = 0,
    red = 0,
    timeLeft = 0;

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
    isTextPreviewMode = false,
    isColorBlindnessEnabled = false;

let dateFormat = "DD/MM/YYYY",
    latestDB = "1.0",
    currentDB = "1.0",
    lastColor = "white";

let countries = ["US", "FM", "MH", "PH"];

let times = [
    //QA (30s)
    [10, 20, 30],
    //Ice-breaker
    [240, 300, 360],
    //1-9 (5 to 7)
    [300, 360, 420],
    //1m
    [30, 45, 60],
    //Evaluator intro
    [60, 75, 90],
    //Evaluator
    [120, 150, 180],
    //General Evaluator
    [300, 330, 360],
    //TT
    [60, 90, 120],
    //10 (8 to 10)
    [480, 540, 600],
    //12m
    [600, 660, 720],
    //15m
    [780, 840, 900],
    //20m
    [1080, 1170, 1200]
];

let intervalTimer;
let playEnableTimeout;

var results = [];

var browserResult = new UAParser().getResult();

progressBar.style.strokeDasharray = length;

function update(value, timePercent) {
    let offset = -length - length * value / (timePercent);
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

function disableLinks(isLinkDisabled) {
    Array.from(externalLinks).forEach((entry) => {
        if (isLinkDisabled)
            entry.setAttribute("disabled", "disabled");
        else
            entry.removeAttribute("disabled");
    });
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
    clearTimeout(playEnableTimeout);
    wholeTime = -1;
    displayTimeLeft(wholeTime);
    wholeTime = 0;
    displayTimeLeft(wholeTime);
    lastColor = bgColors[selectedColor];
    document.body.style.background = lastColor;
    clappingStarted = false;
    setInitialValues();
    txtSpeaker.value = '';
    btnInvert.disabled = false;
    btnPause.disabled = false;
    btnRestart.disabled = true;
    btnStop.disabled = true;
    cmbSpeechType.disabled = false;
    btnEditCustom.disabled = false;
    disableLinks(false);
    isStopped = true;
    isPaused = false;
    imgRestart.src = "img/icons-svg/restart.svg";
    timeLeft = 0;
    currentState = 1;
    browserChangeFavIcon('');
    browserChangeTitle('');
}

function timer(seconds) { //counts time, takes seconds
    let remainTime = Date.now() + seconds * 1000;
    timeLeft = seconds;
    displayTimeLeft(seconds);

    intervalTimer = setInterval(() => {
        timeLeft = Math.round((remainTime - Date.now()) / 1000);
        let counter = maximum - timeLeft;
        if (counter >= minimum && counter < average) {
            green++;
            execAction(greenBgnCss, "green", 'min');
        } else if (counter >= average && counter < maximum) {
            yellow++;
            document.body.style.background = yellowBgnCss;
            execAction(yellowBgnCss, "yellow", 'opt');
        } else if (counter >= maximum) {
            red++;
            execAction(redBgnCss, "red", 'max');
            document.body.style.background = redBgnCss;
        }
        if (counter >= maximum + clappingTime) {
            if (!clappingStarted)
                startClapping();
            clappingStarted = true;
        }
        displayTimeLeft(timeLeft);
    }, 1000);
}

function execAction(bgn, color, icon) {
    document.body.style.background = bgn;
    startBeep();
    startAlert();
    startVibrate();
    lastColor = color;
    browserChangeFavIcon(icon);
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
    btnEditCustom.disabled = true;
    btnStop.disabled = false;

    if (!isStarted || timeLeft === undefined) {
        activateWakeLock();
        disableLinks(true);
        timer(wholeTime);
        isStarted = true;
        btnPause.disabled = true;
        btnPause.classList.remove('play');
        btnPause.classList.add('pause');
        playEnableTimeout = setTimeout(() => {
            btnPause.disabled = false;
        }, 500);
    } else if (isPaused) {
        activateWakeLock();
        disableLinks(true);
        btnPause.disabled = true;
        btnPause.classList.remove('play');
        btnPause.classList.add('pause');
        playEnableTimeout = setTimeout(() => {
            btnPause.disabled = false;
        }, 500);
        timer(timeLeft);
        isPaused = isPaused ? false : true;
    } else {
        deactivateWakeLock();
        disableLinks(false);
        btnPause.classList.remove('pause');
        btnPause.classList.add('play');
        clearInterval(intervalTimer);
        isPaused = isPaused ? false : true;
    }

    btnRestart.disabled = !isPaused;
    if (!isPaused) {
        const sponsor = document.getElementById('bmc-wbtn');
        fade.to(document.getElementById('divSpeechType'), fastTransition, 0.1);
        fade.to(document.getElementById('divSpeaker'), fastTransition, 0.1);
        fade.to(document.getElementById('options'), fastTransition, 0.1);
        fade.to(document.getElementsByTagName('footer')[0], fastTransition, 0.1);

        if (isNinjaMode) {
            fade.to(document.getElementById('controls'), fastTransition, 0.5);
            fade.to(document.getElementsByClassName('circle')[0], fastTransition, 0);
            if (sponsor) fade.to(sponsor, fastTransition, 0);
        }
        else {
            if (sponsor) fade.to(sponsor, fastTransition, 0.1);
        }
        if (sponsor) sponsor.style.pointerEvents = 'none';
    } else {
        unfadeElements();
    }
}

function unfadeElements() {
    fade.to(document.getElementById('divSpeechType'), fastTransition, 1.5);
    fade.to(document.getElementById('divSpeaker'), fastTransition, 1.5);
    fade.to(document.getElementById('options'), fastTransition, 1.5);
    fade.to(document.getElementsByTagName('footer')[0], fastTransition, 1.5);
    fade.to(document.getElementById('controls'), fastTransition, 1.5);
    fade.to(document.getElementsByClassName('circle')[0], fastTransition, 1.5);
    const sponsor = document.getElementById('bmc-wbtn');
    if (sponsor) {
        fade.to(sponsor, fastTransition, 1.5);
        sponsor.style.pointerEvents = '';
    }
}

function displayTimeLeft(timeLeft) { //displays time on the input
    let fixedTime = maximum - timeLeft;
    let hours = Math.floor(fixedTime / 3600);
    let minutes = Math.floor(fixedTime / 60) % 60;
    let seconds = fixedTime % 60;
    let displayString = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    displayOutput.textContent = displayString;
    if (!isContestMode && isStarted)
        browserChangeTitle(displayString);
    update(timeLeft, wholeTime);
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
    minimum = times[selected][0];
    average = times[selected][1];
    maximum = times[selected][2];
}

function openCustomDialog() {
    hasCustomChange = false;
    dialogCustomTimes.showModal();
}

function changeEventHandler() {
    selected = Number(cmbSpeechType.value);
    isCustom = selected === 99;
    btnEditCustom.hidden = !isCustom;
    if (isCustom) {
        minimum = 0;
        average = 0;
        maximum = 0;
        txtCustom.value = cmbSpeechType.selectedOptions[0].textContent;
        openCustomDialog();
        return;
    }
    setBasicIntervals();
    wholeTime = maximum;
    setLocalStorage("wholeTime", maximum);
    updateDisplay();
}

function startBeep() {
    if (isBeepEnabled && (green === 1 || yellow === 1 || red === 1))
        browserStartBeep();
}

function startAlert() {
    if (isTextPreviewMode && (green === 1 || yellow === 1 || red === 1)) {
        switch (lastColor) {
            case "green":
                showSnackbar(lngObject.color2, 3500);
                break;
            case "yellow":
                showSnackbar(lngObject.color3, 3500);
                break;
            default:
                showSnackbar(lngObject.color1, 3500);
        }
    }
}

function startVibrate() {
    if (isVibrateEnabled && (green === 1 || yellow === 1 || red === 1))
        browserStartVibrate();
}

function startClapping() {
    if (isClappingEnabled)
        browserStartClapping();
}

function stopClapping() {
    browserStopClapping();
}

function getVibrate() {
    if (getLocalStorageValue("isVibrateEnabled"))
        isVibrateEnabled = getLocalStorageValue("isVibrateEnabled") === 'true';
    else
        setVibrate();
}

function getClapping() {
    if (getLocalStorageValue("isClappingEnabled"))
        isClappingEnabled = getLocalStorageValue("isClappingEnabled") === 'true';
    else
        setClapping();
}

function getBeep() {
    if (getLocalStorageValue("isBeepEnabled"))
        isBeepEnabled = getLocalStorageValue("isBeepEnabled") === 'true';
    else
        setBeep();
}

function getContestMode() {
    if (getLocalStorageValue("isContestMode"))
        isContestMode = getLocalStorageValue("isContestMode") === 'true';
    else
        setContestMode();
}

function getFirstRun() {
    if (getLocalStorageValue("isFirstRun"))
        isFirstRun = getLocalStorageValue("isFirstRun") === 'true';
    else
        setFirstRun();
}

function getNinjaMode() {
    if (getLocalStorageValue("isNinjaMode"))
        isNinjaMode = getLocalStorageValue("isNinjaMode") === 'true';
    else
        setLocalStorage("isNinjaMode", false);
}

function getColorBlindnessMode() {
    if (getLocalStorageValue("isColorBlindnessEnabled"))
        isColorBlindnessEnabled = getLocalStorageValue("isColorBlindnessEnabled") === 'true';
    else
        setLocalStorage("isColorBlindnessEnabled", false);
}

function switchBgnColors() {
    greenBgnCss = (isColorBlindnessEnabled) ? defGreenCBBgn : defGreenBgn;
    yellowBgnCss = (isColorBlindnessEnabled) ? defYellowCBBgn : defYellowBgn;
    redBgnCss = (isColorBlindnessEnabled) ? defRedCBBgn : defRedBgn;
}

function setRowColors() {
    document.getElementById('bgnGreen').style.backgroundColor = greenBgnCss;
    document.getElementById('bgnYellow').style.backgroundColor = yellowBgnCss;
    document.getElementById('bgnRed').style.backgroundColor = redBgnCss;
}

function getTextPreviewMode() {
    if (getLocalStorageValue("isTextPreviewMode"))
        isTextPreviewMode = getLocalStorageValue("isTextPreviewMode") === 'true';
    else
        setLocalStorage("isTextPreviewMode", false);
}

function getSelectedColor() {
    if (getLocalStorageValue("selectedColor"))
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
        imgTrophy.src = "img/icons-svg/trophy-broken.svg";
    else
        imgTrophy.src = "img/icons-svg/trophy.svg";
}

function setVibrateImg() {
    if (!isVibrateEnabled)
        imgVibrate.src = "img/icons-svg/vibrate-off.svg";
    else
        imgVibrate.src = "img/icons-svg/vibrate.svg";
}

function setBeepImg() {
    if (!isBeepEnabled)
        imgBeep.src = "img/icons-svg/volume-off.svg";
    else
        imgBeep.src = "img/icons-svg/volume-high.svg";
}

function setClappingImg() {
    if (!isClappingEnabled)
        imgClap.src = "img/icons-svg/clapping-off.svg";
    else
        imgClap.src = "img/icons-svg/clapping-hands.svg";
}

function invertColors() {
    let memoryGameIframe = document.getElementById('memoryGameIframe');
    let currentInv = "";
    document.documentElement.classList.toggle("dark-timer", selectedColor === 1);
    if (selectedColor === 1) {
        currentInv = invert100;
        setInvFilter(dialogTimeTable, invert100);
        setInvFilter(dialogWelcome, invert100);
        setInvFilter(dialogConfirm, invert100);
        setInvFilter(dialogChanges, invert100);
        setInvFilter(dialogCustomTimes, invert100);
        setInvFilter(memoryGameIframe, invert100);
        setInvFilter(dialogEasterEgg, invert100);
        setInvFilter(dialogClapping, invert100);
        setInvFilter(speakers, invert100);
        setInvFilter(dialogAbout, invert100);
        setInvFilter(document.body, invert100);
        setBgd(dialogWelcome, bgColors[2]);
        setBgd(dialogConfirm, bgColors[2]);
        setBgd(dialogChanges, bgColors[2]);
        setBgd(dialogCustomTimes, bgColors[2]);
        setBgd(dialogTimeTable, bgColors[2]);
        setBgd(dialogClapping, bgColors[2]);
    }
    else {
        currentInv = invert0;
        setInvFilter(dialogTimeTable, invert0);
        setInvFilter(dialogWelcome, invert0);
        setInvFilter(dialogConfirm, invert0);
        setInvFilter(dialogChanges, invert0);
        setInvFilter(dialogCustomTimes, invert0);
        setInvFilter(memoryGameIframe, invert0);
        setInvFilter(dialogEasterEgg, invert0);
        setInvFilter(dialogClapping, invert0);
        setInvFilter(speakers, invert0);
        setInvFilter(dialogAbout, invert0);
        setInvFilter(document.body, invert0);
        setBgd(dialogWelcome, bgColors[0]);
        setBgd(dialogConfirm, bgColors[0]);
        setBgd(dialogChanges, bgColors[0]);
        setBgd(dialogCustomTimes, bgColors[0]);
        setBgd(dialogTimeTable, bgColors[0]);
        setBgd(dialogClapping, bgColors[0]);
    }

    [].forEach.call(document.getElementsByClassName("noInvert"), (el) => {
        setInvFilter(el, currentInv);
    });

    setBgd(document.body, lastColor);
}

function storeTime(isTimeStored) {
    if (!isStarted) return;

    try {
        deactivateWakeLock();
        stopClapping();

        const counter = maximum - timeLeft;
        if (isTimeStored && counter > 0) {
            const titleSpeechType = isCustom ? txtCustom.value : cmbSpeechType.selectedOptions[0].textContent;
            const disqualified = counter > maximum + clappingTime || counter < minimum - clappingTime;
            addNewTime(txtSpeaker.value, titleSpeechType, getTimeStamp(minimum), getTimeStamp(average), getTimeStamp(maximum), getTimeStamp(counter), lastColor, disqualified);
        }
    } catch (error) {
        console.error('Could not save timer result:', error);
        showSnackbar('Could not save the time.', 4000);
    } finally {
        green = 0;
        yellow = 0;
        red = 0;
        basicReset();
        maximum = isCustom ? getMaxCustom() : times[selected][2];
        wholeTime = maximum;
        browserChangeTitle('');
        unfadeElements();
    }
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
    if ((getMinCustom() > 0 || getAvgCustom() > 0 || getMaxCustom() > 0) && hasCustomChange)
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

btnEditCustom.addEventListener('click', openCustomDialog);

btnPause.addEventListener('click', (event) => {
    if (event.detail === 1)
        pauseTimer();
});

btnRestart.addEventListener('click', () => {
    storeTime(false);
});

btnStop.addEventListener('click', () => {
    storeTime(true);
});

document.getElementById('easterEggLink').addEventListener('click', () => {
    dialogEasterEgg.showModal();
});

btnChampion.addEventListener('click', (event) => {
    if (event.detail === 3) {
        isNinjaMode = !isNinjaMode;

        if (isNinjaMode)
            showSnackbar(lngObject.ninjaEnabled, false);
        else
            showSnackbar(lngObject.ninjaDisabled, false);
        setLocalStorage("isNinjaMode", isNinjaMode);
    } else {
        isContestMode = !isContestMode;
        if (isContestMode)
            browserChangeTitle('');
        else
            browserChangeTitle(displayOutput.textContent);
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

btnBeep.addEventListener('click', (event) => {
    if (event.detail === 3) {
        isTextPreviewMode = !isTextPreviewMode;

        if (isTextPreviewMode)
            showSnackbar(lngObject.colorMsg, 1500);
        else
            showSnackbar(lngObject.colorMsgDis, 1500);

        setLocalStorage("isTextPreviewMode", isTextPreviewMode);
    }
    isBeepEnabled = !isBeepEnabled;
    setBeepImg();
    setBeep();
});

btnClap.addEventListener('click', (event) => {
    if (event.detail === 3) {
        clapM.value = Math.floor(clappingTime / 60);
        clapS.value = clappingTime % 60;
        dialogClapping.showModal();
    } else {
        isClappingEnabled = !isClappingEnabled;
        setClappingImg();
        setClapping();
    }
});

btnSave.addEventListener('click', saveChanges);

btnSaveClap.addEventListener('click', () => {
    clappingTime = Number(clapM.value) * 60 + Number(clapS.value);
    dialogClapping.close();
});

dialogClapping.querySelector('.close').addEventListener('click', () => dialogClapping.close());

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

if (!dialogEasterEgg.showModal) {
    dialogPolyfill.registerDialog(dialogEasterEgg);
}

if (!dialogWelcome.showModal) {
    dialogPolyfill.registerDialog(dialogWelcome);
}

if (!dialogConfirm.showModal) {
    dialogPolyfill.registerDialog(dialogConfirm);
}

btnTimeTable.addEventListener('click', countTimetable);

btnDelete.addEventListener('click', deleteTimetable);

btnYesChallenge.addEventListener('click', () => {
    isContestMode = true;
    setContestImg();
    checkMode();
    setContestMode();
    dialogWelcome.close();
    isFirstRun = false;
    setFirstRun();
});

btnYesConfirm.addEventListener('click', deleteByIDs);

btnInvert.addEventListener('click', (event) => {
    if (event.detail === 3) {
        isColorBlindnessEnabled = !isColorBlindnessEnabled;

        if (isColorBlindnessEnabled)
            showSnackbar(lngObject.cbEnabled, false);
        else
            showSnackbar(lngObject.cbDisabled, false);

        setLocalStorage("isColorBlindnessEnabled", isColorBlindnessEnabled);
        switchBgnColors();
    }

    selectedColor = (selectedColor === 0) ? selectedColor = 1 : selectedColor = 0;

    lastColor = bgColors[selectedColor];
    setSelectedColor();
    invertColors();
    timeDialogInvert(selectedColor);
});

btnYesChanges.addEventListener('click', () => {
    saveChanges();
    dialogChanges.close();
});

btnSponsor2Us.addEventListener('click', () => {
    window.open("https://github.com/sponsors/FANMixco");
});

btnShare.addEventListener('click', async () => {
    const hNone = 'style="display: none!important;"';
    const tmpTable = '<style>table, th, td { border: 1px solid black; border-collapse: collapse; }</style>' + document.getElementById('tblResults').outerHTML.replace(/id="thDel"/g, `id="thDel" ${hNone}`).replace(/class="tdDel/g, `${hNone} class="tdDel`).replace(/filter: invert\(100%\);/g, '').replace(/filter:invert\(100%\);/g, '');
    const tableHtml = document.getElementById('titleMeeting').outerHTML + tmpTable + `<p><i>Exported by Toastmasters Timer. Created by <a href="https://federiconavarrete.com" target="_blank">Federico Navarrete</a></i>.</p>`;

    try {
        await navigator.share({
            title: document.getElementById('titleMeeting').innerHTML,
            text: 'Check out the meeting timing results. Exported by Toastmasters Timer. Created by Federico Navarrete, https://federiconavarrete.com',
            files: [
                new File([tableHtml], `${document.getElementById('titleMeeting').innerHTML.replace(/ /g, '_').replace(/\//g, '_')}.html`, { type: 'text/html' })
            ]
        });
        insertIAd();
    } catch (error) {
        console.error('Error sharing:', error);
    }
});

function insertIAd() {
    // Create a new script element
    const script = document.createElement('script');

    // Set the attributes for the script element
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//thubanoa.com/1?z=7667293';

    // Append the script to the head or body
    document.body.appendChild(script);
}

btnEmail.addEventListener('click', () => { });

btnAbout.addEventListener('click', () => {
    dialogAbout.showModal();
});

txtMin.addEventListener('click', () => {
    setNewTime('txtMin', txtMin.value);
});

txtMax.addEventListener('click', () => {
    setNewTime('txtMax', txtMax.value);
});

txtAvg.addEventListener('click', () => {
    setNewTime('txtAvg', txtAvg.value);
});

btnDownload.addEventListener('click', browserExport);

btnMultiple.addEventListener('click', () => {
    tickAll.checked = true;
    setResultChecks(true);
    if (!multipleEnabled) {
        imgMultiple.src = "img/icons-svg/checkbox-blank-outline.svg";
        showCheckBoxes();
    } else {
        imgMultiple.src = "img/icons-svg/checkbox-outline.svg";
        hideCheckBoxes();
    }
    multipleEnabled = !multipleEnabled;
});

dialogTimeTable.querySelector('.close').addEventListener('click', () => {
    dialogTimeTable.close();
});

dialogEasterEgg.querySelector('.close').addEventListener('click', () => {
    dialogEasterEgg.close();
});

dialogCustomTimes.querySelector('.close').addEventListener('click', closeCustomDialog);

dialogConfirm.querySelector('.close').addEventListener('click', () => {
    dialogConfirm.close();
});

dialogAbout.querySelector('.close').addEventListener('click', () => {
    dialogAbout.close();
});

dialogChanges.querySelector('.close').addEventListener('click', () => {
    dialogChanges.close();
    dialogCustomTimes.close();
});

dialogWelcome.querySelector('.close').addEventListener('click', () => {
    dialogWelcome.close();
    isFirstRun = false;
    setFirstRun();
    showSnackbar(lngObject.noHints);
});

txtCustom.addEventListener("keyup", (e) => {
    if (e.key === 'Enter')
        hideKeyboard(txtCustom);
});

txtSpeaker.addEventListener("keyup", (e) => {
    if (e.key === 'Enter')
        hideKeyboard(txtSpeaker);
});

document.addEventListener('DOMContentLoaded', () => {
    cmbSpeechType.onchange = changeEventHandler;
}, false);

maximum = 0;
wholeTime = 0;

getBeep();
getVibrate();
getClapping();
getContestMode();
getSelectedColor();
getNinjaMode();
getColorBlindnessMode();
switchBgnColors();
getTextPreviewMode();
getFirstRun();
setRowColors();

setContestImg();
setVibrateImg();
setBeepImg();
setClappingImg();
setSelectedColor();

setDateFormat();
initializeDB(currentDB, latestDB);

lastColor = bgColors[selectedColor];
invertColors();

document.querySelectorAll('.dialog-close-icon').forEach(button => {
    const dialog = button.closest('dialog');
    const close = dialog.querySelector('button.close');
    button.setAttribute('aria-labelledby', close.id);
    button.addEventListener('click', () => close.click());
    if (dialog === dialogCustomTimes) {
        dialog.addEventListener('cancel', event => {
            event.preventDefault();
            closeCustomDialog();
        });
    }
});

const aboutTabs = Array.from(dialogAbout.querySelectorAll('[role="tab"]'));

function activateAboutTab(index) {
    aboutTabs.forEach((tab, tabIndex) => {
        const active = tabIndex === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
    aboutTabs[index].focus();
}

aboutTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateAboutTab(index));
    tab.addEventListener('keydown', event => {
        const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        let next;
        if (step) {
            const direction = getComputedStyle(tab).direction === 'rtl' ? -1 : 1;
            next = (index + step * direction + aboutTabs.length) % aboutTabs.length;
        } else if (event.key === 'Home') {
            next = 0;
        } else if (event.key === 'End') {
            next = aboutTabs.length - 1;
        } else {
            return;
        }
        event.preventDefault();
        activateAboutTab(next);
    });
});

checkMode();

tickAll.addEventListener('change', () => setResultChecks(tickAll.checked));

speakers.addEventListener('change', event => {
    if (event.target.matches('.result-checkbox')) tickAll.checked = !speakers.querySelector('.result-checkbox:not(:checked)');
});

(() => {
    btnEmail.style.display = 'none';

    if (os === "iOS") {
        btnVibrate.style.display = "none";
    }

    if (browserResult.browser.name === '2345Explorer' || browserResult.browser.name === 'IE' || browserResult.browser.name === 'IEMobile')
        alert('Unsupported Browser. Please download a modern browser like Chrome or Firefox');

    setTimeout(() => {
        // Checks if should display install popup notification:
        if (os === "iOS" && !isInStandaloneMode())
            showSnackbar(lngObject.installiOS, 3000);

        try {
            if (lngObject.copyright3) {
                document.getElementById('spanCopyright3').innerHTML = `. ${lngObject.copyright3}`;
            }
        } catch { }

        timeDialogInvert(selectedColor);
    }, 1000);
})();

function hideKeyboard(element) {
    element.readOnly = true;
    setTimeout(() => {
        element.blur(); //actually close the keyboard
        element.readOnly = false;
    }, 100);
}

document.addEventListener("keydown", (zEvent) => {
    if (zEvent.ctrlKey && (zEvent.key === "p" || zEvent.key === "P")) {
        pauseTimer();
    }
});

document.addEventListener("keydown", (zEvent) => {
    if (zEvent.ctrlKey && (zEvent.key === "s" || zEvent.key === "S")) {
        btnStop.click();
    }
});

document.addEventListener("keydown", (zEvent) => {
    if (zEvent.ctrlKey && (zEvent.key === "r" || zEvent.key === "R")) {
        btnRestart.click();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loading-container').style.display = "none";
    document.getElementById('superContainer').style.removeProperty('display');

    if (isFirstRun) {
        if ((deviceDetector.device === 'phone' && isTouchDevice()) || deviceDetector.device !== 'phone') {
            if (window.innerWidth > 320) {
                dialogWelcome.showModal();
            } else {
                setFirstRun();
            }
        } else {
            setFirstRun();
        }
    }

    function isTouchDevice() {
        return (('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0));
    }

    ddLang.value = getLocalStorageValue('currentLang');

});

ddLang.onchange = (event) => {
    let confirmed = confirm(lngObject.rWarning);
    if (confirmed) {
        setLocalStorage('currentLang', event.target.value);
        location.reload();
    }
}
