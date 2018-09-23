(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"monster-stories":3}],2:[function(require,module,exports){
'use strict';

const monsters = require('./monster-generator');
const names = require('./name-generator');

function Dungeon(name, foundingYear) {
	this.name = name;
	this.foundingYear = foundingYear;

	this.habitants = [];
}

function yearlyMonsterActions(monster, dungeon, year) {
	if (!monster.alive) {
		return;
	}

	const marriageProbability = 0.2;

	if (!monster.married && Math.random() <= marriageProbability) {
		for (let i = 0; i < dungeon.habitants.length; i++) {
			if (monster.canMarryWith(dungeon.habitants[i]) &&
				dungeon.habitants[i].canMarryWith(monster)) {
				monster.marryTo(dungeon.habitants[i], year);
				dungeon.habitants[i].marryTo(monster, year);
			}
		}
	}

	if (Math.random() * monster.age > 70) {
		monster.die(year);
	}

	++monster.age;
}

function generateDungeonStory(dungeon) {
	dungeon.habitants = dungeon.habitants.concat(
		monsters.generateRandomMonsterFamily(dungeon.foundingYear));

	dungeon.habitants.forEach(hab => {
		hab.story.push(
			'_PRON_ was one of the first settlers of the dungeon');
	});

	const fy = dungeon.foundingYear;

	const migrantProbability = 0.02;
	for (let i = fy; i < fy + 200; i++) {
		if (Math.random() <= migrantProbability) {
			const migrants = monsters.generateRandomMonsterFamily(i);
			dungeon.habitants = dungeon.habitants.concat(migrants);
		}

		dungeon.habitants.forEach(hab => {
			yearlyMonsterActions(hab, dungeon, i);
		});
	}
}

module.exports = () => {
	const name = names.generateRandomDungeonName();
	const foundingYear = Math.floor(Math.random() * 250);

	const dungeon = new Dungeon(name, foundingYear);

	generateDungeonStory(dungeon);

	return dungeon;
};

},{"./monster-generator":4,"./name-generator":5}],3:[function(require,module,exports){
'use strict';

module.exports.generateDungeon = require('./dungeon-generator');
module.exports.generateMonster = require('./monster-generator').generateRandomMonster;
module.exports.generateMonsterFamily = require('./monster-generator').generateRandomMonsterFamily;
module.exports.generateMonsterName = require('./name-generator').generateRandomMonsterName;
module.exports.generateDungeonName = require('./name-generator').generateRandomDungeonName;
module.exports.generateStory = require('./story-generator');

},{"./dungeon-generator":2,"./monster-generator":4,"./name-generator":5,"./story-generator":6}],4:[function(require,module,exports){
'use strict';

const names = require('./name-generator');

function Monster(gender, name, age) {
	this.gender = gender;
	this.name = name;
	this.age = age;

	this.married = false;
	this.alive = true;
	this.so = {};

	this.canMarryWith = function (monster) {
		if (this === monster) {
			// You cannot marry yourself
			return false;
		}

		if (this.married || !this.alive) {
			return false;
		}

		if (this.age < 20 || this.age > 70) {
			// Invalid age
			return false;
		}

		return true;
	};

	this.marryTo = function (monster, year = -1) {
		this.married = true;
		this.so = monster;

		if (year === -1) {
			this.story.push('_PRON_ was married to _SONA_ before coming to ' +
				'the dungeon');
			return;
		}

		this.story.push('_PRON_ married _SONA_ the year ' + year);
		this.story.push('_PRON_ was ' + this.age + ' years old');
	};

	this.die = function (year) {
		this.alive = false;

		this.story.push('_NAME_ died the year ' + year);
		this.story.push('_PRON_ was ' + this.age + ' years old');
	};

	this.story = [];

	switch (this.gender) {
		case 0:
			this.pronoun = 'they';
			this.story.push('_PRON_ was gender neutral');
			break;
		case 1:
			this.pronoun = 'she';
			this.story.push('_PRON_ was a girl monster');
			break;
		case 2:
			this.pronoun = 'he';
			this.story.push('_PRON_ was a boy monster');
			break;
		default:
			throw new Error('Unexpected value for gender: ' + this.gender);
	}
}

function generateRandomMonster(minimumAge = 5, maxAge = 50, year = -1) {
	// 0 -> gender neutral
	// 1 -> girl
	// 2 -> boy
	const gender = Math.floor(Math.random() * 3);
	const name = names.generateRandomMonsterName(gender);
	const extraAge = Math.max(maxAge - minimumAge, 0);
	const age = Math.floor(Math.random() * extraAge) + minimumAge;

	const monster = new Monster(gender, name, age);
	monster.story.push(
		'_PRON_ was ' + monster.age + ' when _PRON_ arrived to the dungeon ' +
		'the year ' + year);

	return monster;
}

// Had to export it this way in order to be able to use it
// on generateRandomMonsterFamily
module.exports.generateRandomMonster = generateRandomMonster;
module.exports.generateRandomMonsterFamily = year => {
	const adults = [];
	const children = [];
	let family = [];

	const numberOfAdults = Math.floor((Math.random() * 3) + 1);

	for (let i = 0; i < numberOfAdults; i++) {
		adults[i] = generateRandomMonster(20, 50, year);
	}

	// Let's decide who marries who
	for (let i = 0; i < adults.length; i++) {
		for (let j = 0; j < adults.length; j++) {
			if (adults[i].canMarryWith(adults[j]) &&
				adults[j].canMarryWith(adults[i])) {
				// I declare you married
				// you may kiss the bride
				adults[i].marryTo(adults[j]);
				adults[j].marryTo(adults[i]);
				break;
			}
		}
	}
	family = family.concat(adults);
	family = family.concat(children);
	return family;
};

},{"./name-generator":5}],5:[function(require,module,exports){
'use strict';

// Not using the 'gender' variable. I have to explicit it by naming it
// '_', if not ESLint complains.
exports.generateRandomMonsterName = _ => {
	const prefixes = [];
	const infixes = [];
	const suffixes = [];

	// Gender neutral prefixes
	prefixes[0] =
		['Un', 'Ku', 'Ra', 'Bo'];
	// Gender neutral infixes
	infixes[0] =
		['vol', 'ryo', 'ka', 'bika'];
	// Gender neutral suffixes
	suffixes[0] =
		['dor', 'lia', 'rup', 'gon'];

	// Only doing gender neutral for the moment

	let name = '';
	name += prefixes[0][Math.floor(Math.random() * prefixes[0].length)];
	name += infixes[0][Math.floor(Math.random() * infixes[0].length)];
	name += suffixes[0][Math.floor(Math.random() * suffixes[0].length)];
	return name;
};

exports.generateRandomDungeonName = () => {
	const firstNames =
		['Brook', 'House', 'Bastion', 'Barrack', 'Cavern', 'Cave'];
	const connectors =
		['Below', 'Above', 'Near', 'of', 'by'];
	const secondNames =
		['River', 'Sea', 'Forest', 'Hills'];

	let name = '';
	name += 'The ';
	name += firstNames[Math.floor(Math.random() * firstNames.length)];
	name += ' ';
	name += connectors[Math.floor(Math.random() * connectors.length)];
	name += ' the ';
	name += secondNames[Math.floor(Math.random() * secondNames.length)];
	return name;
};

},{}],6:[function(require,module,exports){
'use strict';

module.exports = (dungeon, protagonistId = -1) => {
	let story = [];
	if (protagonistId === -1) {
		protagonistId = Math.floor(Math.random() * dungeon.habitants.length);
	}

	const protagonist = dungeon.habitants[protagonistId];

	story.push('there was once a monster called _NAME_');
	story.push('who lived in a dungeon named "_DNAM_"');
	story.push('_NAME_ was cute');
	story = story.concat(protagonist.story);

	for (let i = 0; i < story.length; i++) {
		story[i] = story[i]
			.replace(/_PRON_/gi, protagonist.pronoun)
			.replace(/_NAME_/gi, protagonist.name)
			.replace(/_SONA_/gi, protagonist.so.name)
			.replace(/_DNAM_/gi, dungeon.name)
			.replace(/_FYEA_/gi, dungeon.founding_year);
	}

	return story;
};

},{}]},{},[1]);
