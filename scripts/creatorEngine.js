var room = {};

function createRoom(){
	room["room_name"] = "베이커 거리 221b";
	room["start_scene"] = "scene1";
	room["scene" + 1] = createScene();
}

function createScene(){
	var scene = [];

	scene.push(createMessage("라이벌", "아침", 0.5));
	scene.push(createMessage("라이벌", "점심", 0.5));
	scene.push(createMessage("라이벌", "저녁", 0.5));

	return scene;
}

function createMessage(name, text, delay){
	var message = {};
	message["sender"] = name;
	message["message"] = text;
	message["delay"] = delay;

	return message;
}

function showMessage(){

}

$(document).ready(function(){
	createScene();
	createRoom();
	var json = JSON.stringify(room);
	console.log(json);

	$("#add-room").click(function(){
		$(this).hide();
		$("#add-room-form").show();
	});

	$("#create-room").click(function(){
		$("#add-room-form").hide();
		$("#add-room").show();

		var $tb = $("#room-list>tbody");
		var $tbLast = $($tb.children()[$tb.children().size()-1]);
		var $roomNameInput = $("#input-room-name");

		if($roomNameInput.val() != ''){
			$tbLast.before('<tr><td><button class="btn btn-default">' + $roomNameInput.val() + '</button></td>');
			$roomNameInput.val('');
		}
	});

	$("#add-scene").click(function(){
		$(this).hide();
		$("#add-scene-form").show();
	});

	$("#create-scene").click(function(){
		$("#add-scene-form").hide();
		$("#add-scene").show();

		var $tb = $("#scene-list>tbody");
		var $tbLast = $($tb.children()[$tb.children().size()-1]);
		var $sceneNameInput = $("#input-scene-name");

		if($sceneNameInput.val() != ''){
			$tbLast.before('<tr><td><button class="btn btn-default">' + $sceneNameInput.val() + '</button></td>');
			$sceneNameInput.val('');
		}
	});

	$('#create-message').click(function(){

		var $tb = $("#message-list>tbody");
		var $tbLast = $($tb.children()[$tb.children().size()-1]);

		var addTag = "<tr><td><div class=\"col-xs-2\"></div><div class=\"col-xs-9\"><button class=\"btn btn-default pull-left\">aaaaa</button><button class=\"btn btn-default center-block\">dfdf</button></div><div class=\"col-xs-1\"><button class=\"btn btn-default\">Delete</button></div></td></tr>";

		$tbLast.before(addTag);
	});

});

