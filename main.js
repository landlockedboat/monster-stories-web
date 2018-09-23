const monster_stories = require('monster-stories');
var button = document.getElementById("storygen");

function start() {
	var dungeon_size = 3;
	var dungeon = monster_stories.generateDungeon(dungeon_size);
	var story = monster_stories.generateStory(dungeon);
	document.getElementById("story").innerHTML = story.join('<br/>');
}

button.onclick = start;

start();
