var ALARMS = [];
var Alarm = function(msg, h, m, mode){
	this.msg = msg;
	this.mode = mode;
	this.hour = (mode == "am") ? h : (parseInt(h) + 12);
	this.minute = m;
};

var checker, currentDate, alarmDate;

$(function() {
	$input = $("#string");
	$hours = $("#hours");
	$minutes = $("#minutes");
	$mode = $("#mode");
	$list = $("#list");
	
	$input.focus();
	
	$("#set").click(function(){
		var alarm = new Alarm($input.val(), $hours.val(), $minutes.val(), $mode.val());
		ALARMS.push(alarm);
		setList();
		resetInputs();
	});
	
	$("#reset").click(function(){
		resetInputs();
		$("#list").val("");
	});
	
	checker = setInterval(checkAlarm, 1000);
});
function matchDates(first, second){
	return ( (first.getHours() == second.getHours()) && (first.getMinutes() == second.getMinutes()) );
}
function setList(){
	for(i in ALARMS){
		$list.val($list.val() + ALARMS[i].msg + " - " + ALARMS[i].hour + " : " + ALARMS[i].minute + ALARMS[i].mode + "\n");
	}
}

function checkAlarm(){
	currentDate = new Date();
	alarmDate = new Date();
	for(i in ALARMS){
		alarmDate.setHours(parseInt(ALARMS[i].hour));
		alarmDate.setMinutes(parseInt(ALARMS[i].minute));
		if(matchDates(alarmDate, currentDate)){
			alert(ALARMS[i].msg);
			delete ALARMS[i];
		}
	}
}

function resetInputs(){
	$input = $("#string").val("");
	$hours = $("#hours").val(1);
	$minutes = $("#minutes").val(0);
	ALARMS = [];
	setList();
	$input.focus();
}

function hasLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  }catch(e){ return false; }
}
