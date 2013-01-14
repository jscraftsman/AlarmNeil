var ALARMS = [];
var Alarm = function(msg, h, m, mode){
	this.msg = msg;
	this.mode = mode;
	this.hour = (mode == "AM") ? h : (parseInt(h) + 12);
	this.dhour = (this.hour < 10) ? ("0"+this.hour) : this.hour;
	this.minute = parseInt(m);
	this.dminute = (this.minute < 10) ? ("0"+this.minute) : this.minute;
};
var checker, currentDate, alarmDate;

$(function() {
	$input = $("#string");
	$hours = $("#hours");
	$minutes = $("#minutes");
	$mode = $("#mode");
	$list = $("#displays");
	$error = $("#error");
	
	initTimeOptions();
	
	$input.focus();
	
	$(".msg").live("mouseover", function(){
		$(this).find(".delete").show();
	});
	$(".msg").live("mouseout", function(){
		$(this).find(".delete").toggle();
	});
	
	$(".delete").live("click", function(){
		var alarmID = $(this).attr("alarm-id");
		delete ALARMS[alarmID];
		setList();
	});
	
	$("#set").click(function(){
		if($input.val() != ""){
			currentDate = new Date();
			alarmDate = new Date();
			var alarm = new Alarm($input.val(), $hours.val(), $minutes.val(), $mode.val());
			alarmDate.setHours(parseInt(alarm.hour));
			alarmDate.setMinutes(parseInt(alarm.minute));
			if(alarmDate > currentDate){
				ALARMS.push(alarm);
				resetInputs();
				setHM();
			}else{
				$error.text("Invalid time!");
				$minutes.focus();
			}
		}else{
			$error.text("Input cannot be empty!");
			$input.focus();
		}
	});
	
	$("#reset").click(function(){
		ALARMS = [];
		resetInputs();
		setHM();
		$("#list").html("");
	});
	
	checker = setInterval(checkAlarm, 1000);
});

function initTimeOptions(){
	for(var i = 1; i < 13; i++){
		$hours.append("<option value='" + i + "'>" + i + "</options>");
	}
	for(var i = 0; i < 60; i++){
		$minutes.append("<option value='" + i + "'>" + i + "</options>");
	}
	setHM();
}
function setHM(){
	currentDate = new Date();
	var h = currentDate.getHours();
	$hours.val( (h > 12) ? (h-12) : h);
	$minutes.val(currentDate.getMinutes());	
	$mode.val((currentDate.getHours() < 13) ? "AM" : "PM");
}
function matchDates(first, second){
	return ( (first.getHours() == second.getHours()) && (first.getMinutes() == second.getMinutes()) );
}
function setList(){
	$list.html("");
	for(i in ALARMS){
		$list.append("<div class='msg'><div alarm-id='" + i + "' class='delete right'>delete</div><span>[ " + 
		ALARMS[i].dhour + ":" + ALARMS[i].dminute + " " + ALARMS[i].mode +" ]</span> - <span>" + ALARMS[i].msg + "</span></div>");
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
			setList();
		}
	}
}
function resetInputs(){
	$input = $("#string").val("");
	$hours = $("#hours").val(1);
	$minutes = $("#minutes").val(0);
	setList();
	$error.text("");
	$input.focus();
}
function hasLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  }catch(e){ return false; }
}
