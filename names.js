function getRandomMonsterName(gender) {
  var prefixes = [];
  var infixes = [];
  var suffixes = [];

  // Gender neutral prefixes
  prefixes[0] = 
    ["Un", "Ku", "Ra", "Bo"];
  // Gender neutral infixes
  infixes[0] = 
    ["vol", "ryo", "ka", "bika"];
  // Gender neutral suffixes
  suffixes[0] = 
    ["dor", "lia", "rup", "gon"];

  // Only doing gender neutral for the moment

  var name = "";
  name += prefixes[0][Math.floor(Math.random() * prefixes[0].length)];
  name += infixes[0][Math.floor(Math.random() * infixes[0].length)];
  name += suffixes[0][Math.floor(Math.random() * suffixes[0].length)];
  return name;
}

function getRandomDungeonName() {
  var first_names =
    ["Brook", "House", "Bastion", "Barrack", "Cavern", "Cave"];
  var connectors =
    ["Below", "Above", "Near", "of", "by"];
  var second_names =
    ["River", "Sea", "Forest", "Hills"];

  var name = "";
  name += "The ";
  name += first_names[Math.floor(Math.random() * first_names.length)];
  name += " ";
  name += connectors[Math.floor(Math.random() * connectors.length)];
  name += " the ";
  name += second_names[Math.floor(Math.random() * second_names.length)];
  return name;
}
