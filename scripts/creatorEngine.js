var room = {};
var npc = {};
var player = {};
var system = {};

var nowRoom, nowScene;
var modifyIndex;

function createRoom(name){
	room["room_name"] = name;
}

function createScene(name){
	var scene = [];
	room[name] = scene;

}

function createMessage(name, text, delay, actionList){
	var message = {};
	message["sender"] = name;
	message["message"] = text;
	message["delay"] = delay;

	if(actionList.length != 0)
		message["add_action_list"] = actionList;

	// if(actionTarget != ""){
	// 	var actionList = [];
	// 	actionList.push();
	// 	message["add_action_list"] = actionList;
	// }

	room[nowScene].push(message);
}

function insertMessage(index, name, text, delay, actionList){
	var message = {};
	message["sender"] = name;
	message["message"] = text;
	message["delay"] = delay;
	
	if(actionList.length != 0)
		message["add_action_list"] = actionList;

	// if(actionTarget != ""){
	// 	var actionList = [];
	// 	actionList.push();
	// 	message["add_action_list"] = actionList;
	// }

	room[nowScene].splice(index, 0, message);
}

function showMessage(tbLast, mtext){

	var addTag = "<tr><td><div class=\"col-xs-2\"><button class=\"btn btn-default up-button\">▲</button><button class=\"btn btn-default modify-class\">modify</button></div><div class=\"col-xs-9\"><button value=\""+mtext+"\" class=\"btn btn-default center-block data-class\">"+mtext+"</button></div><div class=\"col-xs-1\"><button class=\"btn btn-default message-delete\">Delete</button></div></td></tr>";

	tbLast.before(addTag);
}

function showAvailable(tbLast, insert){
	var $isender = $('#input-sender');
	var $imessage = $('#input-message');
	var $idelay = $('#input-delay');

	if($imessage.val() == ''){
		return false;
	}

	var $alist = $('#message-form').find('.panel');
	var actionList = [];
	// var atarget = $alist.find('.action-target').html();
	// var tname = $alist.find('.action-name').html();

	// console.log("target : " + atarget + " name : " +tname);

	for(var it = 0; it < $alist.size(); it++){
		var action = {};
		action["name"] = $($alist[it]).find('.action-name').html();
		action["target"] = $($alist[it]).find('.action-target').html();
		actionList.push(action);
	}

	showMessage(tbLast, $imessage.val());
	

	if(insert == undefined){
		createMessage($isender.val(), $imessage.val(), $idelay.val(), actionList);
	} else {
		var $tb = $("#message-list>tbody");
		insertMessage(tbLast.index()-1, $isender.val(), $imessage.val(), $idelay.val(), actionList);
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

function actionTargetClaer(){
	var $removeList = $('#message-form').find('.panel');
	var rmsize = $removeList.size();

	for(var rm = 0; rm < rmsize; rm++){
		$removeList[rm].remove();
	}
}

$(document).ready(function(){

	var json = JSON.stringify(room);
	$('#input-json').val(json);

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
			$tbLast.before("<tr><td><button class=\"btn btn-default home-room data-class\" value=\""+$roomNameInput.val()+"\">" + $roomNameInput.val() + '</button><button value=\"room\" class=\"btn btn-default pull-right data-delete\">Delete</button></td>');
			
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
			$tbLast.before("<tr><td><button class=\"btn btn-default room-scene data-class\" value=\""+$sceneNameInput.val()+"\">" + $sceneNameInput.val() + "</button><button class=\"btn btn-default determine-button\">★</button><button value=\"scene\" class=\"btn btn-default pull-right data-delete\">Delete</button></td>");

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

		$('#action-name').val('');

		actionTargetClaer();

		var json = JSON.stringify(room);
		console.log(json);
	});

	$('#apply-message').click(function(){
		$('#create-message').show();
		$('#apply-message').hide();

		var $btndata = $($('#message-list>tbody').children()[modifyIndex]).find('.data-class');

		room[nowScene][modifyIndex].sender = $('#input-sender').val();
		room[nowScene][modifyIndex].message = $('#input-message').val();
		room[nowScene][modifyIndex].delay = $('#input-delay').val();

		$btndata.val($('#input-message').val());
		$btndata.html($('#input-message').val());

		$('#input-message').val('');

		actionTargetClaer();
	});

	$('#add-message').click(function(){
		if($(this).hasClass('btn-default')){
			
			$($('#message-list').find('.btn-primary'))
				.removeClass('btn-primary')
				.addClass('btn-default');

			$(this)
				.removeClass('btn-default')
				.addClass('btn-primary');

			$('#create-message').show();
			$('#apply-message').hide();

			$('#input-message').val('');
			$('#action-name').val('');
		}
	});

});

$(document).on('click', 'button.data-delete', function(){
	if($(this).val() == "home"){
		room = {};
	} else {
		var rtext = $(this).closest('tr').find('.data-class').val();
		
		$.each(room, function(key, value){
			if(key == rtext){
				room[key] = undefined;
			}
		});
	}

	$(this).closest('tr').remove();
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

		$('#create-message').show();
		$('#apply-message').hide();

		$('#input-message').val('');
		$('#action-name').val('');
	}
});

$(document).on('click', 'button.modify-class', function(){
	var mtext = $(this).closest('tr');
	modifyIndex = mtext.index();

	$('#input-sender').val(room[nowScene][mtext.index()].sender);
	$('#input-message').val(room[nowScene][mtext.index()].message);
	$('#input-delay').val(room[nowScene][mtext.index()].delay);

	$('#create-message').hide();
	$('#apply-message').show();

	actionTargetClaer();

	for(var al in room[nowScene][mtext.index()].add_action_list){

		var atarget = room[nowScene][mtext.index()].add_action_list[al].target;
		var tname = room[nowScene][mtext.index()].add_action_list[al].name;

		var panel = "<div class=\"panel panel-default\"><div class=\"panel-body\"><span class=\"action-target\">"+atarget+"</span> : <span class=\"action-name\">"+tname+"</span><button type=\"button\" class=\"btn btn-default pull-right action-delete\">Delete</button></div></div>";

		$('#add-action').closest('.input-group').after(panel);
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
			$tbLast.before("<tr><td><button class=\"btn btn-default room-scene data-class\" value=\""+key+"\">" + key + "</button><button class=\"btn btn-default determine-button\">★</button><button value=\"scene\" class=\"btn btn-default pull-right data-delete\">Delete</button></td>");
		}
	});

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

	$.each(room, function(key, value){
		if(key != "room_name" && key != "start_scene"){
			$('#action-menu').append("<li class=\"target-class btn\">"+key+"</li>");
		}
	});

	$('#json-frame').addClass('hide-class');
});

$(document).on('click', '#index1', function(){
	if($('#frame-index').children().size() == 2){
		$('#scene-list').addClass('hide-class');
		$('#room-list').removeClass('hide-class');
		$('#index2').remove();
		$('#frame2').hide();

		screenClear("scene");

		$('#create-message').show();
		$('#apply-message').hide();

	} else if($('#frame-index').children().size() == 3){
		$('#message-list').addClass('hide-class');
		$('#room-list').removeClass('hide-class');
		$('#index2').remove();
		$('#index3').remove();
		$('#frame2').hide();

		screenClear("scene");
		screenClear("message");

		$('#create-message').show();
		$('#apply-message').hide();
	}
});

$(document).on('click', '#index2', function(){
	if($('#frame-index').children().size() == 3){
		$('#message-list').addClass('hide-class');
		$('#scene-list').removeClass('hide-class');
		$('#index3').remove();
		$('#frame2').hide();

		screenClear("message");

		$('#create-message').show();
		$('#apply-message').hide();

		$('#json-frame').removeClass('hide-class');
	}
});

$(document).on('click', 'li.target-class', function(){
	var atext = $(this).html();
	var ntext = $('#action-name').val();
	var panel = "<div class=\"panel panel-default\"><div class=\"panel-body\"><span class=\"action-target\">"+atext+"</span> : <span class=\"action-name\">"+ntext+"</span><button type=\"button\" class=\"btn btn-default pull-right action-delete\">Delete</button></div></div>";

	if(ntext == '' || ntext == undefined){
		return;
	}

	$(this).closest('.input-group').after(panel);

	$('#action-name').val('');
});

$(document).on('click', 'button.action-delete', function(){
	$(this).parent().parent().remove();
});

$(document).on('click', '.btn-default', function(){
	var json = JSON.stringify(room);
	$('#input-json').val(json);
});