function Monster(gender, name, age)
{
  this.gender = gender;
  this.name = name;
  this.age = age;

  this.married = false;
  this.alive = true;
  this.so = {};

  this.canMarryWith = function (monster) 
  {
    if(this === monster)
    {
      // You cannot marry yourself 
      return false;
    }

    if (this.married || !this.alive)
    {
      return false;
    }

    if(this.age < 20 || this.age > 70)
    {
      // Invalid age
      return false; 
    }

    return true;
  };

  this.marryTo = function (monster, year = -1)
  {
    this.married = true;          
    this.so = monster;

    if(year !== -1)
    {
      this.story.push("_PRON_ married _SONA_ the year " + year);
      this.story.push("_PRON_ was " + this.age + " years old");
    }
    else
    {
      this.story.push("_PRON_ was married to _SONA_ before coming to " + 
          "the dungeon");
    }
  };

  this.die = function(year)
  {
    this.alive = false;

    this.story.push("_NAME_ died the year " + year);
    this.story.push("_PRON_ was " + this.age + " years old");
  }

  this.story = [];

  switch (this.gender)
  {
    case 0:
      this.pronoun = "they";
      this.story.push("_PRON_ was gender neutral");
      break;
    case 1:
      this.pronoun = "she";
      this.story.push("_PRON_ was a girl monster");
      break;
    case 2:
      this.pronoun = "he";
      this.story.push("_PRON_ was a boy monster");
      break;
  }

}

function getRandomMonster(minimum_age = 5, max_age = 50, year = -1) {
  // 0 -> gender neutral
  // 1 -> girl
  // 2 -> boy
  var gender = Math.floor(Math.random() * 3);
  var name = getRandomMonsterName(gender);
  var extra_age = Math.max(max_age - minimum_age, 0);
  var age = Math.floor(Math.random() * extra_age) + minimum_age;

  var monster = new Monster(gender, name, age);
  monster.story.push(
      "_PRON_ was " + monster.age + " when _PRON_ arrived to the dungeon " +
      "the year " + year);

  return monster;
}

function getRandomMonsterFamily(year)
{
  var adults = [];
  var children = [];
  var family = [];

  var number_of_adults = Math.floor(Math.random() * 3 + 1);

  for (var i = 0; i < number_of_adults; i++)
  {
    adults[i] = getRandomMonster(20, 50, year);
  }

  // Let's decide who marries who
  for (var i = 0; i < adults.length; i++)
  {
    for (var j = 0; j < adults.length; j++)
    {
      if(adults[i].canMarryWith(adults[j]) &&
          adults[j].canMarryWith(adults[i]))
      {
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
}
