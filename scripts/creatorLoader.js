var jfile;

function load(){
	$.getJSON( "./game_scenario_001.json", function( data ){
		jfile = data;
		rooms = {};

		screenClear("room");
		screenClear("scene");
		screenClear("message");

	}).fail(function(a,b,c){
		console.log("load info fail",a,b,c);
	}).success(function(data, textStatus, jqXHR){
		
		jsonRooms();

		var json = JSON.stringify(rooms);
		$('#input-json').val(wordTrans(json));
		
	});

}

function jsonRooms(){
	var $tb = $("#room-list>tbody");
	var $tbLast = $($tb.children()[$tb.children().size()-1]);

	$.each(jfile, function(key, value){
		$tbLast.before("<tr><td><button class=\"btn btn-default home-room data-class\" value=\""+key+"\">" +key+ '</button><button value=\"room\" class=\"btn btn-default pull-right data-delete\">Delete</button></td>');

		createRoom(key);
		jsonScenes(key);
	});
}

function jsonScenes(rname){
	var $tb = $("#scene-list>tbody");
	var $tbLast = $($tb.children()[$tb.children().size()-1]);

	$.each(jfile[rname], function(key, value){
		if(key == "start_scene"){
			rooms[rname]["start_scene"] = value;
		} else if(key == "date"){

		} else{

			createScene(key, rname);
			jsonMessage(rname, key);
		}
	});
}

function jsonMessage(rname, sname){

	$.each(jfile[rname][sname], function(key, value){
		// console.log(value.sender);
		createMessage(value.sender, value.message, value.delay, value.add_action_list, rname, sname);
	});
}