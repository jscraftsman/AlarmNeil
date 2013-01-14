$(function() {
	$input = $("#string");
	$hours = $("#hours");
	$minutes = $("#minutes");
	$list = $("#list");
	
	$("#set").click(function(){
		var string = $input.val(),
		hour = $hours.val(),
		minute = $minutes.val();
		$list.append(string + " - " + hour + " : " + minute + "\n");
	});
	
	$("#reset").click(function(){
		resetInputs();
		$("#list").val("");
		
	});
	function resetInputs(){
		$input = $("#string").val("");
		$hours = $("#hours").val(0);
		$minutes = $("#minutes").val(0);
	}
});


function hasLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  }catch(e){ return false; }
}
