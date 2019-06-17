let bgColors = ["white", "#121212", "#EDEDED"];

function isDarkModeEnabled() {
	return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 1 : 0;
}

function setInvFilter(ctrl, inv) {
    ctrl.style.filter = inv;
}

function setBgd(ctrl, bgd) {
    ctrl.style.background = bgd;
}