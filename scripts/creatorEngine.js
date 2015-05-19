var rooms = {};
var npc = {};
var player = {};
var system = {};

var nowRoom, nowScene;
var modifyIndex;

var time = 0;
var timeFocus = false;

function createRoom(name){
	var inroom = {};
	rooms[name] = inroom;
}

function createScene(name){
	var scene = [];
	rooms[nowRoom][name] = scene;
}

function createMessage(name, text, delay, actionList){
	var message = {};
	message["sender"] = name;
	message["message"] = text;
	message["delay"] = delay;

	if(actionList.length != 0)
		message["add_action_list"] = actionList;

	rooms[nowRoom][nowScene].push(message);
}

function insertMessage(index, name, text, delay, actionList){
	var message = {};
	message["sender"] = name;
	message["message"] = text;
	message["delay"] = delay;
	
	if(actionList.length != 0)
		message["add_action_list"] = actionList;

	rooms[nowRoom][nowScene].splice(index, 0, message);
}

function showMessage(tbLast, mtext){

	var addTag = "<tr><td><div class=\"col-xs-2\"><button class=\"btn btn-default up-button\">↗</button><button class=\"btn btn-default modify-class\">modify</button></div><div class=\"col-xs-9\"><button value=\""+mtext+"\" class=\"btn btn-default center-block data-class\">"+mtext+"</button></div><div class=\"col-xs-1\"><button class=\"btn btn-default message-delete\">Delete</button></div></td></tr>";

	tbLast.before(addTag);
}

function createAction(){
	var $alist = $('#message-form').find('.panel');
	var actionList = [];

	for(var it = 0; it < $alist.size(); it++){
		var action = {};
		action["name"] = $($alist[it]).find('.action-name').html();
		action["target"] = $($alist[it]).find('.action-target').html();
		actionList.push(action);
	}

	return actionList;
}

function showAvailable(tbLast, tdelay, insert){
	var $isender = $('#input-sender');
	var $imessage = $('#input-message');
	var $idelay = $('#input-delay');
	var delay;

	if($imessage.val() == ''){
		return false;
	}

	if(tdelay == 0){
		delay = time / 5;
	} else {
		delay = $idelay.val();
	}

	var actionList = [];

	actionList = createAction();

	showMessage(tbLast, $imessage.val());
	

	if(insert == undefined){
		createMessage($isender.val(), $imessage.val(), delay, actionList);
	} else {
		var $tb = $("#message-list>tbody");
		insertMessage(tbLast.index()-1, $isender.val(), delay, $idelay.val(), actionList);
	}

	$imessage.val('');
	$idelay.val('');

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

function actionMenuClear(){
	var $chi = $('#action-menu');

	$chi.children().each(function(){
		$(this).remove();
	});
}

function actionTargetClaer(){
	var $removeList = $('#message-form').find('.panel');
	var rmsize = $removeList.size();

	for(var rm = 0; rm < rmsize; rm++){
		$removeList[rm].remove();
	}
}

function run(){
	
	time += 1;

	if(timeFocus){
		return setTimeout(run, 1000);
	}
}

$(document).ready(function(){

	var json = JSON.stringify(rooms);
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
		var idelay = $('#input-delay').val();

		if($primaryButton.length == 0){
			var $tb = $("#message-list>tbody");
			var $tbLast = $($tb.children()[$tb.children().size()-1]);

			showAvailable($tbLast, idelay);
		} else{
			showAvailable($primaryButton, idelay, 'on');
		}

		$('#action-name').val('');

		actionTargetClaer();

	});

	$('#apply-message').click(function(){
		$('#create-message').show();
		$('#apply-message').hide();

		var $btndata = $($('#message-list>tbody').children()[modifyIndex]).find('.data-class');

		rooms[nowRoom][nowScene][modifyIndex].sender = $('#input-sender').val();
		rooms[nowRoom][nowScene][modifyIndex].message = $('#input-message').val();
		rooms[nowRoom][nowScene][modifyIndex].delay = $('#input-delay').val();
		rooms[nowRoom][nowScene][modifyIndex].add_action_list = createAction();


		$btndata.val($('#input-message').val());
		$btndata.html($('#input-message').val());

		$('#input-message').val('');
		$('#input-delay').val('');

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

	$('#input-message').focus(function(){
		timeFocus = true;
		run();
	});

	$('#input-message').focusout(function(){
		timeFocus = false;
	});

});

$(document).on('click', 'button.data-delete', function(){
	if($(this).val() == "room"){
		var tname = $(this).closest('td').find('.data-class').val();
		delete rooms[tname];
	} else {
		var rtext = $(this).closest('tr').find('.data-class').val();

		$.each(rooms[nowRoom], function(key, value){
			if(key == rtext){
				delete rooms[nowRoom][key];
				if(rooms[nowRoom]["start_scene"] != undefined && key == rooms[nowRoom]["start_scene"]){
					delete rooms[nowRoom]["start_scene"];
				}
			}

		});
	}

	$(this).closest('tr').remove();
});

$(document).on('click', 'button.message-delete', function(){
	
	for(var ms in rooms[nowRoom][nowScene]){
		if(rooms[nowRoom][nowScene][ms].message == $(this).closest('tr').find('.data-class').val()){
			rooms[nowRoom][nowScene].splice(ms, 1);
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

	$('#input-sender').val(rooms[nowRoom][nowScene][mtext.index()].sender);
	$('#input-message').val(rooms[nowRoom][nowScene][mtext.index()].message);
	$('#input-delay').val(rooms[nowRoom][nowScene][mtext.index()].delay);

	
	$('#create-message').hide();
	$('#apply-message').show();

	actionTargetClaer();

	for(var al in rooms[nowRoom][nowScene][mtext.index()].add_action_list){

		var atarget = rooms[nowRoom][nowScene][mtext.index()].add_action_list[al].target;
		var tname = rooms[nowRoom][nowScene][mtext.index()].add_action_list[al].name;

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

		rooms[nowRoom]["start_scene"] = $(this).parent().find('.room-scene').val();
	}
});

$(document).on('click', 'button.home-room', function(){
	$('#room-list').addClass('hide-class');
	$('#scene-list').removeClass('hide-class');

	$('#frame-index').append('<li id="index2">Room</a></li>');

	nowRoom = $(this).val();

	var $tb = $("#scene-list>tbody");
	var $tbLast = $($tb.children()[$tb.children().size()-1]);

	$.each(rooms[nowRoom], function(key, value){
		if(key != "start_scene"){
			var aclass = null;
			if(key == rooms[nowRoom]["start_scene"]){
				aclass = "btn-success";
			}
			$tbLast.before("<tr><td><button class=\"btn btn-default room-scene data-class\" value=\""+key+"\">" + key + "</button><button class=\"btn btn-default determine-button " + aclass + "\">★</button><button value=\"scene\" class=\"btn btn-default pull-right data-delete\">Delete</button></td>");
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

	for(var ms in rooms[nowRoom][nowScene]){
		showMessage($tbLast, rooms[nowRoom][nowScene][ms].message);
	}

	$.each(rooms[nowRoom], function(key, value){
		if(key != "start_scene"){
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
		actionMenuClear();

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
		actionMenuClear();

		$('#create-message').show();
		$('#apply-message').hide();

		$('#json-frame').removeClass('hide-class');
	}
});

$(document).on('click', '#index2', function(){
	if($('#frame-index').children().size() == 3){
		$('#message-list').addClass('hide-class');
		$('#scene-list').removeClass('hide-class');
		$('#index3').remove();
		$('#frame2').hide();

		screenClear("message");
		actionMenuClear();

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
	var json = JSON.stringify(rooms);
	$('#input-json').val(json);
	time = 0;
	timeFocus = false;
});