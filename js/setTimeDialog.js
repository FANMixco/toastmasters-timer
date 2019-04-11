const	btnSetTime = document.getElementById('btnSetTime'),
		btnClearTime = document.getElementById('btnClearTime'),
		dialogSetTime = document.getElementById('setTimeDialog'),
		setTimeH = document.getElementById('setTimeH'),
		setTimeM = document.getElementById('setTimeM'),
		setTimeS = document.getElementById('setTimeS');

let chosenInputText = "";

btnSetTime.addEventListener('click', function() {
	$(`#${chosenInputText}`)[0].parentElement.MaterialTextfield.change(`${setTimeH.value}:${setTimeM.value}:${setTimeS.value}`);
    dialogSetTime.close();
});

btnClearTime.addEventListener('click', function() {
	setDropDownValue("#setTimeH0", "#divSetTimeH");
	setDropDownValue("#setTimeM0", "#divSetTimeM");	
	setDropDownValue("#setTimeS0", "#divSetTimeS");
});

if (!dialogSetTime.showModal) {
    dialogPolyfill.registerDialog(dialogSetTime);
}

dialogSetTime.querySelector('.close').addEventListener('click', function() {
    dialogSetTime.close();
});

function openSetDialog(time){
	let unit = time.split(":");
	setDropDownValue(`#setTimeH${Math.floor(parseInt(unit[0]) / 3600)}`, "#divSetTimeH");
	setDropDownValue(`#setTimeM${Math.floor(parseInt(unit[1]) / 60)}`, "#divSetTimeM");
	setDropDownValue(`#setTimeS${parseInt(unit[2]) % 60}`, "#divSetTimeS");
}

function setNewTime(inputText, currentTxt){
	chosenInputText = inputText;
	if (currentTxt === '00:00:00' || currentTxt === '' || currentTxt === undefined) {
		setDropDownValue("#setTimeH0", "#divSetTimeH");
		setDropDownValue("#setTimeM0", "#divSetTimeM");	
		setDropDownValue("#setTimeS0", "#divSetTimeS");
	}
	else
		openSetDialog(currentTxt);
	try {
		dialogSetTime.showModal();
	}
	catch (e) {}
}