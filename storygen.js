function getRandomStory(dungeon) {
  var story = [];
  var protagonist_id = Math.floor(Math.random() * dungeon.habitants.length);
  var protagonist = dungeon.habitants[protagonist_id];


  story.push("there was once a monster called _NAME_");
  story.push("who lived in a dungeon named \"_DNAM_\"");
  story.push("_NAME_ was cute");
  story = story.concat(protagonist.story);

  var story_string = "";
  for(var i = 0; i < story.length; i++)
  {
    story_string += story[i] + "<br>";
  }

  story_string = story_string.replace(/_PRON_/gi, protagonist.pronoun);
  story_string = story_string.replace(/_NAME_/gi, protagonist.name);
  story_string = story_string.replace(/_SONA_/gi, protagonist.so.name);
  story_string = story_string.replace(/_DNAM_/gi, dungeon.name);
  story_string = story_string.replace(/_FYEA_/gi, dungeon.founding_year);
  return story_string;
}

function generateStory() {
  var dungeon_size = 3;
  var dungeon = getRandomDungeon(dungeon_size);
  var story = getRandomStory(dungeon);
  document.getElementById("story").innerHTML = story;
}

generateStory();
