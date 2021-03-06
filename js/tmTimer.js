const DB_VERSION = "2.0";
var audioElement, audioElementClapping;
var counter = 1, selected = -1, minimum = 0, average = 0, maximum = 0, selectedColor = 0, green = 0, yellow = 0, red = 0;
var lastColor = "white", isBeepEnabled = "false", isVibrateEnabled = "false", isStickEnabled = "false", isClappingEnabled = "false", latestDB = "1.0", currentDB = "1.0";
var isPaused = false, isStarted = false, isCustom = false, isFirstTime = false, multipleEnabled = false, hasVibrator = true;
var dateFormat = "dd/MM/yyyy";
var bColors = ["white", "black"], countries = ["US", "FM", "MH", "PH"];
var supportsOrientationChange = "onorientationchange" in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
var os = getMobileOperatingSystem();
if (os == "iOS" || os == "Android") $("#btnBeep,#btnClapping").hide();

const isDesktop = () => {
    const navigatorAgent =
      navigator.userAgent || navigator.vendor || window.opera;
    return !(
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series([46])0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        navigatorAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br([ev])w|bumb|bw-([nu])|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do([cp])o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly([-_])|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-([mpt])|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c([- _agpst])|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac([ \-/])|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja([tv])a|jbro|jemu|jigs|kddi|keji|kgt([ /])|klon|kpt |kwc-|kyo([ck])|le(no|xi)|lg( g|\/([klu])|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t([- ov])|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30([02])|n50([025])|n7(0([01])|10)|ne(([cm])-|on|tf|wf|wg|wt)|nok([6i])|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan([adt])|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c([-01])|47|mc|nd|ri)|sgh-|shar|sie([-m])|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel([im])|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c([- ])|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
        navigatorAgent.substr(0, 4)
      )
    );
  };

var times = [
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

function setDateFormat() {
    try {
        if (countries.includes(navigator.language.split('-')[1]))
            dateFormat = "MM/dd/yyyy";
    }
    catch (e) {
        if (isValueInArray(countries, navigator.language.split('-')[1]))
            dateFormat = "MM/dd/yyyy";
    }
}

function setLocalStorage(key, val) {
    if (getLocalStorageValue(key) !== null)
        removeLocalStorage(key);
    localStorage.setItem(key, val);
}

function getLocalStorageValue(key) {
    return localStorage.getItem(key);
}

function removeLocalStorage(key) {
    localStorage.removeItem(key);
}

function getTimeStamp(time) {
    return (new Date).clearTime().addSeconds(time).toString("HH:mm:ss");
}

function getTime() {
    return getTimeStamp(counter);
}

function enableVibrator() {
	navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
	if (navigator.vibrate && (os == "iOS" || os == "Android")) {
		hasVibrator = true;
        $("#btnVibrate").show();
	}
	else
        $("#btnVibrate").hide();
}

function setDbConf() {
    currentDB = getLocalStorageValue("currentDB");

    if (currentDB !== getLocalStorageValue("latestDB") || currentDB === null) {
        setLocalStorage("currentDB", DB_VERSION);
        setLocalStorage("latestDB", DB_VERSION);
        latestDB = DB_VERSION;
    }
}

function verifyLastColor() {
    if (counter >= minimum && counter < average)
        lastColor = "green";
    else if (counter >= average && counter < maximum)
        lastColor = "yellow";
    else if (counter >= maximum)
        lastColor = "red";
    else
        lastColor = bColors[selectedColor];
}

function btnStopClick(isAdded) {
    stopClapping();

    if (isStarted && isAdded) {
        counter = counter - 1;
        verifyLastColor();
        addNewTime($("#txtMember").val(), $("#selectTimes").find(":selected").text(), getTimeStamp(minimum), getTimeStamp(average), getTimeStamp(maximum), getTime(), lastColor, ((counter > (maximum + 30)) || (counter < (minimum - 30))));
        showSnackBar(currentTranslation.recorded, true);
    }

    $("#btnPause,#btnRestart").hide();
    $("#btnPlay,#btnRestartBasic").show();
    $("#innerTime").text("00:00:00");
    $("#txtMember").val("");
    $("#selectTimes,#btnRestartBasic").prop("disabled", false);
    $(".externalLinks").removeClass("linkColG");
    $(".externalLinks").removeClass("linkCol");
    $(".externalLinks").removeClass("linkColY");

    counter = 1;
    isPaused = true;
    isStarted = false;
    green = 0;
    yellow = 0;
    red = 0;
    setImgAndBng();
}

function startBeep() {
    if (isBeepEnabled === "true" && !(os == "iOS" || os == "Android")) {
        if (green === 1 || yellow === 1 || red === 1) {
            audioElement.play();
            setTimeout(function() {
                audioElement.pause();
            }, 500);
        } else {
            audioElement.pause();
        }
    }
}

function startVibrate() {
    if (isVibrateEnabled === "true")
        if (green === 1 || yellow === 1 || red === 1)
			if (hasVibrator)
                navigator.vibrate(1000);
}

function getBeep() {
    if (localStorage.getItem("myBeep") !== null)
        isBeepEnabled = localStorage.getItem("myBeep");
    else
        setBeep(isBeepEnabled);
}

function isStick() {
    if (getLocalStorageValue("isStick") === null)
        $("#divStickMsg").modal();
    else {
        isStickEnabled = getLocalStorageValue("isStick");
        if (isStickEnabled === "true") {
            $("#innerTime").show();

            if (errorLng) {
                setTimeout(function () {
                    setTimer("timer-off");
                }, 150);
            }
            else
                setTimer("timer-off");
        }
    }
}

function setTimer(loc) {
    if (selectedColor === 0 && (lastColor === "white" || lastColor === "yellow"))
        $("#btnVisibleTimer").attr("src", `images/${loc}-gray.png`);
    else
        $("#btnVisibleTimer").attr("src", `images/${loc}.png`);
}

function getVibrate() {
    if (getLocalStorageValue("myVibrate") !== null)
        isVibrateEnabled = getLocalStorageValue("myVibrate");
    else
        setVibrate(isVibrateEnabled);
}

function getClapping() {
    if (getLocalStorageValue("myClapping") !== null)
        isClappingEnabled = getLocalStorageValue("myClapping");
    else
        setClapping(isClappingEnabled);
}

function getCurrentColor() {
    if (getLocalStorageValue("myPreferedColor") !== null)
        selectedColor = parseInt(getLocalStorageValue("myPreferedColor"));
    else
        setColor(selectedColor);
}

function setBeep(beep) {
    setLocalStorage("myBeep", beep);
}

function setVibrate(vibrate) {
    setLocalStorage("myVibrate", vibrate);
}

function setClapping(clapping) {
    setLocalStorage("myClapping", clapping);
}

function setColor(color) {
    setLocalStorage("myPreferedColor", color);
}

function setSticky(sticky) {
    setLocalStorage("isStick", sticky);
}

function btnStartClick() {
    if (isStarted) return;
    isStarted = true;
    isPaused = false;
    selected = $("#selectTimes").val();

    if (selected === "" || selected === null) return;

    if (!isCustom) {
        minimum = times[selected][0];
        average = times[selected][1];
        maximum = times[selected][2];
    }
    startTimer();
    $("#selectTimes,#btnRestart").prop("disabled", "disabled");
    if (selectedColor === 0)
        changeImages("-gray");
    else
        changeImages("");
}

function startTimer() {
    var clappingStarted = false;
    counter = counter || 1;
    var setTime = setInterval(function() {
        if (isPaused)
            clearInterval(setTime);
        else {
            $("#innerTime").text(getTime());
            if (counter >= minimum && counter < average) {
                changeImages("");
                lastColor = "green";
                $("#innerTime,.lblFooter").css("color", "white");
                $(".externalLinks").addClass("linkColY");
                green++;
                startBeep();
                startVibrate();
	    }
            else if (counter >= average && counter < maximum) {
                changeImages("-gray");
                lastColor = "yellow";
                $(".lblFooter").css("color", "black");
                $("#innerTime").css("color", "#757575");
                $(".externalLinks").removeClass("linkColY");
                $(".externalLinks").addClass("linkCol");
                yellow++;
                startBeep();
                startVibrate();
            }
            else if (counter >= maximum) {
                changeImages("");
                lastColor = "red";
                $("#innerTime,.lblFooter").css("color", "white");
                $(".externalLinks").removeClass("linkCol");
                $(".externalLinks").addClass("linkColY");
                red++;
                startBeep();
                startVibrate();
            }
            else {
                $(".externalLinks").removeClass("linkCol");
                $(".externalLinks").removeClass("linkColY");
                lastColor = bColors[selectedColor];
            }
            if (counter >= maximum + 30) {
                if (!clappingStarted)
                    startClapping();
                clappingStarted = true;
            }
            setBgnColor();
            counter++;
        }
    }, 1000);
}

function startClapping() {
    if (isClappingEnabled === "true" && !(os == "iOS" || os == "Android"))
    {
            audioElementClapping.play();
            setTimeout(function() {
                audioElementClapping.pause();
            }, 1500);
    }
}

function stopClapping() {
    if (!(os == "iOS" || os == "Android"))
	audioElementClapping.pause();
}

function changeImages(extra) {
    if (isStickEnabled === "true")
        $("#btnVisibleTimer").attr("src", `images/timer-off${extra}.png`);
    else
        $("#btnVisibleTimer").attr("src", `images/timer${extra}.png`);
    $("#btnPlay").attr("src", `images/play${extra}.png`);
    $("#btnPause").attr("src", `images/pause${extra}.png`);
    $("#btnStop").attr("src", `images/stop${extra}.png`);
    if (!isPaused && isStarted)
        setRestartBtnImg(extra, "-dis", currentTranslation.titleRestart2);
    else
        setRestartBtnImg(extra, "", currentTranslation.titleRestart);
    $("#btnTable").attr("src", `images/table${extra}.png`);
    $("#btnInvert").attr("src", `images/invert-colors${extra}.png`);
    $("#imgModalInfo").attr("src", `images/info${extra}.png`);
    setVolumeBtnImg(extra);
    setVibrateBtnImg(extra);
    setClappingBtnImg(extra);
}

function setRestartBtnImg(extra, opt, title) {
    $("#btnRestartBasic,#btnRestart").attr("src", `images/restart${extra}${opt}.png`);
    $("#btnRestartBasic").attr("title", title).tooltip("fixTitle");
}

function setVolumeBtnImg(extra) {
    if (isBeepEnabled === "true")
        $("#btnBeep").attr("src", `images/volume${extra}.png`);
    else
        $("#btnBeep").attr("src", `images/volume-off${extra}.png`);
}

function setVibrateBtnImg(extra) {
    if (isVibrateEnabled === "false")
        $("#btnVibrate").attr("src", `images/vibrate-off${extra}.png`);
    else
        $("#btnVibrate").attr("src", `images/vibrate${extra}.png`);
}

function setClappingBtnImg(extra) {
    if (isClappingEnabled === "true")
        $("#btnClapping").attr("src", `images/clapping${extra}.png`);
    else
        $("#btnClapping").attr("src", `images/clapping-off${extra}.png`);
}

function setVolumeImg() {
    setBeep(isBeepEnabled);
    if (selectedColor === 0 && (lastColor === "white" || lastColor === "yellow"))
        setVolumeBtnImg("-gray");
    else
        setVolumeBtnImg("");
}

function setVibrateImg() {
    setVibrate(isVibrateEnabled);
    if (selectedColor === 0 && (lastColor === "white" || lastColor === "yellow"))
        setVibrateBtnImg("-gray");
    else
        setVibrateBtnImg("");
}

function setClappingImg() {
    setClapping(isClappingEnabled);
    if (selectedColor === 0 && (lastColor === "white" || lastColor === "yellow"))
        setClappingBtnImg("-gray");
    else
        setClappingBtnImg("");
}

function changeImagesByColor() {
    if (selectedColor === 0 && (lastColor === "white" || lastColor === "yellow"))
        changeImages("-gray");
    else
        changeImages("");
}

function resizeDivImage() {
    $(".divImage,#tblControls,#tdMiddle").height($(window).height() - $(".bottom-footer").height() - $("#options").height());
}

function setBgnColor() {
    $("body,#timeContent,#divCurrentTime").css("background-color", lastColor);
}

function setImgAndBng() {
    if (selectedColor === 1) {
        changeImages("");
        $("#innerTime,.lblFooter").css("color", "white");
    } else {
        changeImages("-gray");
        $(".lblFooter").css("color", "black");
        $("#innerTime").css("color", "#757575");
    }
    setColor(selectedColor);
    lastColor = bColors[selectedColor];
    setBgnColor();
}

function setObjTranslations() {
    setTimeout(function() {
        $("#cTopic").html(`<b>${currentTranslation.meetingAt} ${(new Date).toString('dd/MM/yyyy')}</b>`);
    }, 150);
    if ($(window).width() > 800) {
        $("head").append("<link href='css/select2.min.css' rel='stylesheet' />");
        $.getScript("js/select2.min.js").done(function () {
            setTimeout(function() {
                $("#selectTimes").addClass("js-example-basic-single");
                $("#selectTimes").select2({
                    placeholder: currentTranslation.chooseTime
                });
            }, 150);
        });
    } else {
        $("#selectTimes").addClass("form-control");
        setTimeout(function() {
            $("#emptyOption").text(currentTranslation.chooseTime);
        }, 150);
        $('#emptyOption').prop("disabled", true);
        $('#emptyOption').attr("value", "");
    }
}

function showSnackBar(msg) {
    $("#spanMsg").text(msg);
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function() {
        x.className = x.className.replace("show", "");
    }, 3000);
}

function resizeModal() {
    let currentWindowHeight = $(window).height();
    if ($("#divContent").height() > $(window).height()) {
        $("#divTable").height($(window).height() * 0.75);
        $("#divTable").css("overflow-y", "auto");
    } else {
        $("#divTable").css("height", "");
        $("#divTable").css("overflow-y", "");
    }
    setTimeout(function () {
        if ($("#divContent").height() > currentWindowHeight)
            resizeModal();
    }, 50);
}

function btnPlay() {
    var state = $("#selectTimes").val();
    if (state === "" || state === null) {
        showSnackBar(currentTranslation.chooseSpeech, true);
        return;
    }
    if ((isCustom || state === "11") && (minimum + average + maximum) === 0) {
        showSnackBar(currentTranslation.emptyCustom, false);
        return;
    }
    isStarted = false;
    btnStartClick();
    $("#btnPlay,#btnRestart").hide();
    $("#btnPause,#btnRestartBasic").show();
    changeImagesByColor();
}

function btnPause() {
    stopClapping();
    isPaused = true;
    $("#btnPause,#btnRestartBasic").hide();
    $("#btnPlay,#btnRestart").show();
    changeImagesByColor();
}

function setSelect2(selVal) {
    if ($(window).width() > 800) {
        if (selVal > -1)
            $("#selectTimes").select2({
                placeholder: currentTranslation.chooseTime
            }).val(`${selVal}`).trigger("change");
        else
            $("#selectTimes").select2({
                placeholder: currentTranslation.chooseTime
            }).val("").trigger("change");
    }
    else {
        if (selVal > -1)
            $("#selectTimes").val(selVal);
        else
            $("#selectTimes").val("");
    }
}

function isStickFirstTime(sticky) {
    setSticky(sticky);
    isStickEnabled = sticky;
    $("#divStickMsg").modal("toggle");
}

window.addEventListener(orientationEvent, function () {
    resizeDivImage();
}, false);

$(function () {
	if (!(os == "iOS" || os == "Android")) {
	    audioElement = document.createElement('audio');
	    audioElement.setAttribute('src', 'sounds/beep.mp3');

	    audioElement.addEventListener('ended', function() {
		this.play();
	    }, false);

	    audioElement.addEventListener("canplay", function() {});

	    audioElement.addEventListener("timeupdate", function() {});

	    audioElementClapping = document.createElement('audio');
	    audioElementClapping.setAttribute('src', 'sounds/clapping.mp3');

	    audioElementClapping.addEventListener('ended', function() {
		this.play();
	    }, false);

	    audioElementClapping.addEventListener("canplay", function() {});

	    audioElementClapping.addEventListener("timeupdate", function() {});
	}
    setDbConf();
    $.fn.hideKeyboard = function () {
        var inputs = this.filter("input").attr("readonly", "readonly"); // Force keyboard to hide on input field.
        setTimeout(function () {
            inputs.blur().removeAttr("readonly");  //actually close the keyboard and remove attributes
        }, 100);
        return this;
    };

    function getSelectedIDs() {
        var ids = [];
        $("input.chkDel[type=checkbox]").each(function () {
            if (this.checked)
                ids.push(parseInt($(this).attr("id").replace("chk", "")));
        });
        return ids;
    }

    function restart() {
        btnStopClick(false);
        isCustom = false;
        minimum = 0;
        average = 0;
        maximum = 0;
        setSelect2(-1);
    }

    $("#btnDelete").confirmation({
        rootSelector: "[data-toggle=confirmation]",
        popout: true,
        onConfirm: function () {
            multipleEnabled = false;
            if (!isStarted) {
                isStarted = false;
                btnStopClick(isStarted);
            }
            clearTimetable();
            showSnackBar(currentTranslation.deletedAgenda, true);
            $("#hNoResults").show();
            $("#tblResults,#footerResult").hide();
            resizeModal();
        }
    });
    $("#btnRestart").confirmation({
        rootSelector: "[data-toggle=confirmation]",
        popout: true,
        onConfirm: function () {
            restart();
        }
    });

    $("#btnDeleteMultiple").confirmation({
        rootSelector: "[data-toggle=confirmation]",
        popout: true,
        onConfirm: function () {
            var ids = getSelectedIDs();

            if (ids.length > 0) {
                var totalItems = deleteByIDs(ids);
                if (!isStarted) {
                    isStarted = false;
                    btnStopClick(isStarted);
                }
                showSnackBar(currentTranslation.deletedRoles, true);
				
				totalItems.onsuccess = function() {
					if (totalItems.result === 0) {
						multipleEnabled = false;
						clearTimetable();
						$("#hNoResults").show();
						$("#tblResults,#footerResult").hide();
					}
					resizeModal();					
				};
            }
        }
    });

    setTimeout(function() {
        resizeDivImage();
    }, 50);
    $(".timing").timingfield();
    $("[data-toggle='tooltip']").tooltip();
    $("[data-toggle='tooltip']").on("hidden.bs.tooltip", function () {
        $(this).tooltip("disable");
    });
    if (errorLng) {
        setTimeout(function() {
            setObjTranslations();
        }, 150);
    } else
        setObjTranslations();
    $("#selectTimes").on("change", function () {
        if ($(this).val() === "11")
            $("#divCustomTime").modal();
        else
            isCustom = false;
    });
    $("#linkResults").click(function(e) {
        e.preventDefault();
        let value = $("#selectTimes").val();
        multipleEnabled = false;
        countTimetable();
        printTable();
        $("#btnDelete").show();
        $("#btnDeleteMultiple,.tdDel,#thDel").hide();
        $("#lblMultiple").text(currentTranslation.multiple);
        $("#icnMultiple").removeClass();
        $("#icnMultiple").toggleClass("glyphicon glyphicon-check");
        setSelect2(value);
        if ($("#divCustomTime").data('bs.modal') && $("#divCustomTime").data('bs.modal').isShown)
            $("#divCustomTime").modal("toggle");
    });
    $("#btnClear").click(function () {
	let option = "input[type=text]";
        let iTxts = [2, 3, 4, 6, 7, 8, 10, 11, 12];
	if (os == "iOS" || os == "Android")
		option = "input[type=number]";
	for (let i = 0; i < 9; i++)
	    $(option)[iTxts[i]].value = "0";
    });
    $("#btnPlay").click(function() {
        btnPlay();
    });
    $("#btnPause").click(function() {
        btnPause();
    });
    $("#btnStop").click(function() {
        btnStopClick(true);
    });
    $("#btnBeep").click(function() {
        if (isBeepEnabled === "true")
            isBeepEnabled = "false";
        else
            isBeepEnabled = "true";
        setVolumeImg();
    });
    $("#btnVibrate").click(function() {
        if (isVibrateEnabled === "true")
            isVibrateEnabled = "false";
        else
            isVibrateEnabled = "true";
        setVibrateImg();
    });
    $("#btnClapping").click(function () {
        if (isClappingEnabled === "true") {
            isClappingEnabled = "false";
            stopClapping();
        }
        else
            isClappingEnabled = "true";
        setClappingImg();
    });
    $("#btnRestartBasic").click(function () {
        if (isStarted && !isPaused) return;
        restart();
    });
    $("#btnRYes").click(function () {
        restart();
    });

    $("#btnSave").click(function() {
		var option = "input[type=text]";
		if (os == "iOS" || os == "Android")
			option = "input[type=number]";
        var minTime = parseInt($(option)[0].value * 3600) + parseInt($(option)[1].value * 60) + parseInt($(option)[2].value);
        var avgTime = parseInt($(option)[3].value * 3600) + parseInt($(option)[4].value * 60) + parseInt($(option)[5].value);
        var maxTime = parseInt($(option)[6].value * 3600) + parseInt($(option)[7].value * 60) + parseInt($(option)[8].value);

        if (minTime >= avgTime)
            showSnackBar(currentTranslation.errorMin);
        else if (minTime >= maxTime)
            showSnackBar(currentTranslation.errorHalf);
        else if (avgTime >= maxTime)
            showSnackBar(currentTranslation.errorMax);
        else {
            isCustom = true;
            minimum = minTime;
            average = avgTime;
            maximum = maxTime;
            $("#divCustomTime").modal("toggle");
        }
    });

    $("#btnInvert").click(function() {
        if (selectedColor === 0)
            selectedColor = 1;
        else
            selectedColor = 0;
        setImgAndBng();
    });

    $("[data-toggle]").click(function() {
        var _this = this;
        setTimeout(function () { $(_this).tooltip("hide"); }, 1500);
    });

    $("#linkDownload").click(function(e) {
        showSnackBar(currentTranslation.lblExportMsg);
        setTimeout(function() {
			var doc = new jsPDF('l', 'pt', 'a4');
			var res = doc.autoTableHtmlToJson(document.getElementById("tblResults"));
			doc.autoTable(res.columns, res.data, {
			  startY: 60
			});
			doc.save();
		}, 250);
    });
    $("#btnVisibleTimer").click(function () {
        if (isStickEnabled === "false") {
            isStickEnabled = "true";
            setSticky(isStickEnabled);
            $("#innerTime").show();
            setTimer("timer-off");
        }
        else {
            isStickEnabled = "false";
            setSticky(isStickEnabled);
            $("#innerTime").hide();
            setTimer("timer");
        }
    });
    $("#btnStick").click(function () {
        isStickFirstTime("true");
        $("#innerTime").show();
        setTimer("timer-off");
    });
    $("#btnUnstick").click(function () {
        isStickFirstTime("false");
    });
    $("#btnMultiple").click(function () {
        if (!multipleEnabled) {
            $("#icnMultiple").toggleClass("glyphicon-check").toggleClass("glyphicon-unchecked");
            $("#btnDelete").hide();
            $(".tdDel,#thDel,#btnDeleteMultiple").show();
        }
        else {
            $("#icnMultiple").toggleClass("glyphicon-unchecked").toggleClass("glyphicon-check");
            $("#btnDelete").show();
            $(".tdDel,#thDel,#btnDeleteMultiple").hide();
            $('input:checkbox').prop("checked", false);
        }
        multipleEnabled = !multipleEnabled;
    });
    $("#txtMember,input[type=number]").on('keyup', function(e) {
        if (e.keyCode === 13)
            $(this).hideKeyboard();
    });
    $("#chkAll").change(function () {
        if (this.checked)
            $('input:checkbox').not(this).prop('checked', this.checked);
        else
            $('input:checkbox').prop("checked", false);
    });

    getCurrentColor();
    getBeep();
    getVibrate();
    getClapping();
    setVolumeImg();
    enableVibrator();
    isStick();
    setDateFormat();
    initializeDB(currentDB, latestDB);

    setTimeout(function () {
        if (isDesktop()) {
            $(".select2").width("200");
        }
    }, 1000);
});
