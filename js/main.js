var ALARMS = [];
var TIMECONVERTER = {
	TOHOUR12 : function(h24){
		if(h24 == 0){
			return {h: 12, mode: 'AM'};
		}else if(h24 == 12){
			return {h: 12, mode: 'PM'};
		}else if(h24 > 12){
			return {h: (h24 - 12), mode: 'PM'};
		}else{
			return {h: h24, mode: 'AM'};
		}
	},
	TOHOUR24 : function(h12, mode){
		if(h12 == 12 && mode == 'AM'){
			return 0;
		}else if(h12 != 12 && mode == 'PM'){
			return (h12 + 12);
		}else{
			return h12;
		}
	}
}

var Alarm = function(msg, h, m, mode){
	this.msg = msg;
	this.mode = mode;
	this.hour = parseInt(TIMECONVERTER.TOHOUR24(h, mode));
	var dh = (TIMECONVERTER.TOHOUR12(this.hour)).h;
	this.dhour = (dh < 10) ? ("0" + dh) : dh;
	this.minute = parseInt(m);
	this.dminute = (this.minute < 10) ? ("0" + this.minute) : this.minute;
};
var checker, currentDate, alarmDate, havePermission, askcount = 0;


$(function() {
	$input = $("#string");
	$hours = $("#hours");
	$minutes = $("#minutes");
	$mode = $("#mode");
	$list = $("#displays");
	$error = $("#error");
	$sound = document.getElementById("sound");
	
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
		havePermission = window.webkitNotifications.checkPermission();
		if(havePermission != 0 && askcount == 0){
			window.webkitNotifications.requestPermission();
			askcount++;
		}
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
	var h = TIMECONVERTER.TOHOUR12(currentDate.getHours());
	$hours.val(h.h);
	$minutes.val(currentDate.getMinutes());	
	$mode.val(h.mode);
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
			$sound.currentTime = 0;
			$sound.play();
			if(havePermission == 0){
				createNotification(ALARMS[i].msg);
			}else{
				alert(ALARMS[i].msg);
			}
			delete ALARMS[i];
			setList();
		}
	}
}
function createNotification(msg){
	var notification = window.webkitNotifications.createNotification(
		'http://icons.iconarchive.com/icons/danrabbit/elementary/48/Apps-checkbox-icon.png',
		msg,
		'Click to close'
    );
    
	notification.ondisplay = function(){
		setTimeout(function(){
			notification.close();
		}, 5000);
	}
	
    notification.onclick = function () {
      notification.close();
    }
    notification.show();
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
