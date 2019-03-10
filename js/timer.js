//circle ends
const displayOutput = document.querySelector('.display-remain-time'),
      btnPause = document.getElementById('pause'),
      btnRestart = document.getElementById('btnRestart'),
      btnStop = document.getElementById('btnStop'),
      btnTimeTable = document.querySelector('#btnTimetable'),
      btnChampion = document.querySelector('#btnChampion'),
      btnBeep = document.querySelector('#btnBeep'),
      btnVibrate = document.querySelector('#btnVibrate'),
      btnClap = document.querySelector('#btnClap'),
      imgClap = document.querySelector('#imgClap'),
      dialogTimeTable = document.getElementById('timeTable');

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
	document.body.style.background = "white";
    clappingStarted = false;
	setInitialValues();
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
		} else if (counter >= average && counter < maximum) {
            yellow++;
			document.body.style.background = "#ffeb3b";
            startBeep();
            startVibrate();
		} else if (counter >= maximum) {
            red++;
			document.body.style.background = "#e53935";
            startBeep();
            startVibrate();
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

	minimum = times[selected][0];
	average = times[selected][1];
	maximum = times[selected][2];

	wholeTime = maximum;
	update(wholeTime, wholeTime); //refreshes progress bar
	displayTimeLeft(wholeTime);
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
        setVibrate(isVibrateEnabled);
}

function getClapping() {
    if (getLocalStorageValue("isClappingEnabled") !== null)
        isClappingEnabled = (getLocalStorageValue("isClappingEnabled") === 'true');
    else
        setClapping(isClappingEnabled);
}

function getBeep() {
    if (getLocalStorageValue("isBeepEnabled") !== null)
        isBeepEnabled = (getLocalStorageValue("isBeepEnabled") === 'true');
    else
        setBeep(isBeepEnabled);
}

function getContestMode() {
    if (getLocalStorageValue("isContestMode") !== null)
        isContestMode = (getLocalStorageValue("isContestMode") === 'true');
    else
        setBeep(isContestMode);
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

btnPause.addEventListener('click', pauseTimer);

btnRestart.addEventListener('click', event => {
    if (minimum === 0 && maximum === 0 && average === 0) return;
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
        
    maximum = times[selected][2]
	basicReset();
	wholeTime = maximum;
});

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

btnTimeTable.addEventListener('click', function () {
    countTimetable();
});

dialogTimeTable.querySelector('.close').addEventListener('click', function () {
	dialogTimeTable.close();
});

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('cmbSpeechType').onchange = changeEventHandler;
}, false);

maximum = 0;
wholeTime = 0;

getBeep();
getVibrate();
getClapping();
getContestMode();

setContestImg();
setVibrateImg();
setBeepImg();
setClappingImg();
