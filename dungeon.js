function Dungeon(name, founding_year)
{
  this.name = name;
  this.founding_year = founding_year;

  this.habitants = [];
}

function yearlyMonsterActions(monster, dungeon, year){
  if(!monster.alive)
  {
    return;
  }

  var marriage_probability = .2;

  if(!monster.married && Math.random() <= marriage_probability)
  {
    for (var i = 0; i < dungeon.habitants.length; i++)
    {
      if(monster.canMarryWith(dungeon.habitants[i]) &&
          dungeon.habitants[i].canMarryWith(monster))
      {
        monster.marryTo(dungeon.habitants[i], year);
        dungeon.habitants[i].marryTo(monster, year);
      }
    }
  }

  if(Math.random() * monster.age > 70)
  {
    monster.die(year);
  }

  ++monster.age;
}


function generateDungeonStory(dungeon)
{
  dungeon.habitants = dungeon.habitants.concat(
      getRandomMonsterFamily(dungeon.founding_year));

  dungeon.habitants.forEach(function (hab) {
    hab.story.push(
        "_PRON_ was one of the first settlers of the dungeon");
  });

  var fy = dungeon.founding_year;

  var migrant_probability = 0.02;
  for(var i = fy; i < fy + 200; i++)
  {
    if(Math.random() <= migrant_probability)
    {
      var migrants = getRandomMonsterFamily(i);
      dungeon.habitants = dungeon.habitants.concat(migrants);
      console.log(migrants.length + " migrants arrived on the year " + i);
    }

    dungeon.habitants.forEach(function (hab)
        {
          yearlyMonsterActions(hab, dungeon, i);
        });
  }
}

function getRandomDungeon(){
  var name = getRandomDungeonName();
  var founding_year = Math.floor(Math.random() * 250);

  var dungeon = new Dungeon(name, founding_year);

  generateDungeonStory(dungeon);

  return dungeon;
}
