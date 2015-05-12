var room = {};
var npc = {};
var player = {};
var system = {};

var nowRoom, nowScene;

function createRoom(name){
	room["room_name"] = name;
	// room["start_scene"] = "scene1";
	// room["scene" + 1] = createScene();
}

function createScene(name){
	var scene = [];
	room[name] = scene;

	// scene.push(createMessage("라이벌", "아침", 0.5));
	// scene.push(createMessage("라이벌", "점심", 0.5));
	// scene.push(createMessage("라이벌", "저녁", 0.5));

	// return scene;
}

function createMessage(name, text, delay){
	var message = {};
	message["sender"] = name;
	message["message"] = text;
	message["delay"] = delay;

	room[nowScene].push(message);
}

function insertMessage(index, name, text, delay){
	var message = {};
	message["sender"] = name;
	message["message"] = text;
	message["delay"] = delay;

	room[nowScene].splice(index, 0, message);
}

function modifyMessage(){

}

function showMessage(tbLast, mtext){

	var addTag = "<tr><td><div class=\"col-xs-2\"><button class=\"btn btn-default up-button\">▲</button><button class=\"btn btn-default\">modify</button></div><div class=\"col-xs-9\"><button value=\""+mtext+"\" class=\"btn btn-default center-block data-class\">"+mtext+"</button></div><div class=\"col-xs-1\"><button class=\"btn btn-default message-delete\">Delete</button></div></td></tr>";

	tbLast.before(addTag);
}

function showAvailable(tbLast, insert){
	var $isender = $('#input-sender');
	var $imessage = $('#input-message');
	var $idelay = $('#input-delay');

	if($imessage.val() == ''){
		return false;
	}

	showMessage(tbLast, $imessage.val());
	

	if(insert == undefined){
		createMessage($isender.val(), $imessage.val(), $idelay.val());
	} else {
		var $tb = $("#message-list>tbody");
		insertMessage(tbLast.index()-1, $isender.val(), $imessage.val(), $idelay.val());
	}

	$imessage.val('');
	return true;
}

function screenClear(name){
	var $temp = $("#" + name + "-list>tbody");
	var $blacklist = [];

	$temp.children().each(function(){
		if($(this).attr('id') != "nodelete"){
			$(this).remove();
		}
	});

}

$(document).ready(function(){
	// createScene();
	// createRoom();
	// var json = JSON.stringify(room);
	// console.log(json);

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
			$tbLast.before("<tr><td><button class=\"btn btn-default home-room data-class\" value=\""+$roomNameInput.val()+"\">" + $roomNameInput.val() + '</button><button class=\"btn btn-default pull-right\">Delete</button></td>');
			
			createRoom($roomNameInput.val());

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
			$tbLast.before("<tr><td><button class=\"btn btn-default room-scene data-class\" value=\""+$sceneNameInput.val()+"\">" + $sceneNameInput.val() + "</button><button class=\"btn btn-default determine-button\">★</button><button class=\"btn btn-default pull-right\">Delete</button></td>");

			createScene($sceneNameInput.val());

			$sceneNameInput.val('');
		}
	});

	$('#create-message').click(function(){
		var $primaryButton = $('#message-list').find('.btn-primary').closest('tr');

		if($primaryButton.length == 0){
			var $tb = $("#message-list>tbody");
			var $tbLast = $($tb.children()[$tb.children().size()-1]);

			showAvailable($tbLast);
		} else{
			showAvailable($primaryButton, 'on');
		}

		var json = JSON.stringify(room);
		console.log(json);
	});

	$('#add-message').click(function(){
		if($(this).hasClass('btn-default')){
			
			$($('#message-list').find('.btn-primary'))
				.removeClass('btn-primary')
				.addClass('btn-default');

			$(this)
				.removeClass('btn-default')
				.addClass('btn-primary');
		}
	});

});

$(document).on('click', 'button.message-delete', function(){
	
	for(var ms in room[nowScene]){
		if(room[nowScene][ms].message == $(this).closest('tr').find('.data-class').val()){
			room[nowScene].splice(ms, 1);
		}
		
	}

	$(this).closest('tr').remove();
});

$(document).on('click', 'button.up-button', function(){
	if($(this).hasClass('btn-default')){
		
		$($('#message-list').find('.btn-primary'))
			.removeClass('btn-primary')
			.addClass('btn-default');

		$(this)
			.removeClass('btn-default')
			.addClass('btn-primary');
	}
});

$(document).on('click', 'button.determine-button', function(){
	if($(this).hasClass('btn-default')){

		$($('#scene-list').find('.btn-success'))
			.removeClass('btn-success')
			.addClass('btn-default');

		$(this)
			.removeClass('btn-default')
			.addClass('btn-success');

		room["start_scene"] = $(this).parent().find('.room-scene').val();
	}
});

$(document).on('click', 'button.home-room', function(){
	$('#room-list').addClass('hide-class');
	$('#scene-list').removeClass('hide-class');

	$('#frame-index').append('<li id="index2">Room</a></li>');

	nowRoom = $(this).val();

	var $tb = $("#scene-list>tbody");
	var $tbLast = $($tb.children()[$tb.children().size()-1]);

	$.each(room, function(key, value){
		if(key != "room_name" && key != "start_scene"){
			$tbLast.before("<tr><td><button class=\"btn btn-default room-scene\" value=\""+key+"\">" + key + '</button></td>');
		}
	})

});

$(document).on('click', 'button.room-scene', function(){
	$('#scene-list').addClass('hide-class');
	$('#message-list').removeClass('hide-class');

	$('#frame-index').append('<li id="index3">Scene</a></li>');

	$('#frame2').show();

	nowScene = $(this).val();

	var $tb = $("#message-list>tbody");
	var $tbLast = $($tb.children()[$tb.children().size()-1]);

	for(var ms in room[nowScene]){
		showMessage($tbLast, room[nowScene][ms].message);
	}

});

$(document).on('click', '#index1', function(){
	if($('#frame-index').children().size() == 2){
		$('#scene-list').addClass('hide-class');
		$('#room-list').removeClass('hide-class');
		$('#index2').remove();
		$('#frame2').hide();

		screenClear("scene");

	} else if($('#frame-index').children().size() == 3){
		$('#message-list').addClass('hide-class');
		$('#room-list').removeClass('hide-class');
		$('#index2').remove();
		$('#index3').remove();
		$('#frame2').hide();

		screenClear("scene");
		screenClear("message");
	}
});

$(document).on('click', '#index2', function(){
	if($('#frame-index').children().size() == 3){
		$('#message-list').addClass('hide-class');
		$('#scene-list').removeClass('hide-class');
		$('#index3').remove();
		$('#frame2').hide();

		screenClear("message");
	}
});