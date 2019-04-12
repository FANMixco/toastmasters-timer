const btnSetTime = document.getElementById('btnSetTime'),
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

function openSetDialog(time) {
    let unit = time.split(":");
    setDropDownValue(`#setTimeH${parseInt(unit[0])}`, "#divSetTimeH");
    setDropDownValue(`#setTimeM${parseInt(unit[1])}`, "#divSetTimeM");
    setDropDownValue(`#setTimeS${parseInt(unit[2])}`, "#divSetTimeS");
}

function setNewTime(inputText, currentTxt) {
    chosenInputText = inputText;
    if (currentTxt === '00:00:00' || currentTxt === '' || currentTxt === undefined) {
        setDropDownValue("#setTimeH0", "#divSetTimeH");
        setDropDownValue("#setTimeM0", "#divSetTimeM");
        setDropDownValue("#setTimeS0", "#divSetTimeS");
    } else
        openSetDialog(currentTxt);
    try {
        dialogSetTime.showModal();
    } catch (e) {}
}