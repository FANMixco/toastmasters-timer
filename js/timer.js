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
      imgClap = document.getElementById('imgClap'),
      dialogTimeTable = document.getElementById('timeTable'),
      dialogCustomTimes = document.getElementById('customTimes'),
      txtSpeaker = document.getElementById('txtSpeaker'),
      cmbSpeechType = document.getElementById('cmbSpeechType'),
      remainTime = document.getElementById('remainTime'),
      titleMeeting = document.getElementById('titleMeeting'),
      divSpeaker = document.getElementById('divSpeaker'),
      btnDelete = document.getElementById('btnDelete'),
      btnInvert = document.getElementById('btnInvert');

let wholeTime = 30,
	selected = -1,
	minimum = 0,
	average = 0,
	maximum = 0,
	selectedColor = 0,
	green = 0,
	yellow = 0,
	red = 0;

let isPaused = false,
    isStarted = false,
    isBeepEnabled = false,
    isVibrateEnabled = false,
    isClappingEnabled = false,
    isContestMode = false,
    clappingStarted = false;

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
    return moment.utc(seconds*1000).format('HH:mm:ss');
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
}

function timer(seconds) { //counts time, takes seconds
	let remainTime = Date.now() + (seconds * 1000);
	displayTimeLeft(seconds);

	intervalTimer = setInterval(function () {
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
        if (counter >= maximum + 30) {
            if (!clappingStarted)
                startClapping();
            clappingStarted = true;
        }
		displayTimeLeft(timeLeft);
	}, 1000);
}

function pauseTimer(event) {
    if (minimum === 0 && maximum === 0 && average === 0) return;

    btnInvert.disabled = true;
    btnRestart.disabled = true;
    
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

function changeEventHandler(event) {
	selected = hiddenSpeechType.value;
    
    if (selected != 11){
        minimum = times[selected][0];
        average = times[selected][1];
        maximum = times[selected][2];

        wholeTime = maximum;
        update(wholeTime, wholeTime); //refreshes progress bar
        displayTimeLeft(wholeTime);        
    }
    else
        console.log('custom');
    //    dialogCustomTimes.showModal()
}

function startBeep() {
    if (isBeepEnabled && (green === 1 || yellow === 1 || red === 1)) console.log('beep');
        //CSharp.Beep();
}

function startVibrate() {
    if (isVibrateEnabled && (green === 1 || yellow === 1 || red === 1)) console.log('vibrate');
        //CSharp.Vibrate();
}

function startClapping() {
    if (isClappingEnabled) console.log('clap');
        //CSharp.StartClapping();
}

function stopClapping() {
    console.log('stop clapping');
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
    console.log('invertColors');
    if (selectedColor === 1)
        $('body').css('filter', 'invert(100%)');        
    else
        $('body').css('filter', 'invert(0%)');        
	document.body.style.background = lastColor;
}

btnPause.addEventListener('click', pauseTimer);

btnRestart.addEventListener('click', event => {
    if (minimum === 0 && maximum === 0 && average === 0){
        return;
        resetState();
    }
    stopClapping();
    
	maximum = 30;
	basicReset();

	wholeTime = 0; // manage this to set the whole time
	maximum = 0;
	minimum = 0;
	average = 0;
});

btnStop.addEventListener('click', event => {
    if (minimum === 0 && maximum === 0 && average === 0) return;
    stopClapping();
    
    let counter = maximum - timeLeft;    
    addNewTime(txtSpeaker.value, cmbSpeechType.value, getTimeStamp(minimum), getTimeStamp(average), getTimeStamp(maximum), getTimeStamp(counter), lastColor, ((counter > (maximum + 30)) || (counter < (minimum - 30))));
        
    maximum = times[selected][2]
	basicReset();
	wholeTime = maximum;
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

btnClap.addEventListener('click', event => {
    isClappingEnabled = !isClappingEnabled;
    setClappingImg();
    setClapping();
});

if (!dialogTimeTable.showModal) {
	dialogPolyfill.registerDialog(dialogTimeTable);
}

if (!dialogCustomTimes.showModal) {
	dialogPolyfill.registerDialog(dialogCustomTimes);
}

btnTimeTable.addEventListener('click', countTimetable);

btnDelete.addEventListener('click', deleteTimetable);

btnInvert.addEventListener('click', function () {
    if (selectedColor === 0)
        selectedColor = 1;
    else
        selectedColor = 0;
    lastColor = bgColors[selectedColor];
    setSelectedColor();
    invertColors();
});

dialogTimeTable.querySelector('.close').addEventListener('click', function () {
	dialogTimeTable.close();
});

dialogCustomTimes.querySelector('.close').addEventListener('click', function () {
	dialogCustomTimes.close();
});

document.addEventListener('DOMContentLoaded', function () {
	cmbSpeechType.onchange = changeEventHandler;
}, false);

cmbSpeechType.addEventListener('click', function () {
    if (document.body.clientHeight < 650){
        setTimeout(function() {
            let container = document.getElementsByClassName('mdl-menu__container')[0];
            container.style.height = `${document.body.clientHeight * 0.84}px`;
            container.style.overflowY = "auto";
        }, 50);
    }
});

maximum = 0;
wholeTime = 0;

getBeep();
getVibrate();
getClapping();
getContestMode();
getSelectedColor();

setContestImg();
setVibrateImg();
setBeepImg();
setClappingImg();
setSelectedColor();

setDateFormat();
initializeDB(currentDB, latestDB);

lastColor = bgColors[selectedColor];
invertColors();

titleMeeting.innerHTML = `Meeting at ${moment((new Date())).format("YYYY/MM/DD")}`;