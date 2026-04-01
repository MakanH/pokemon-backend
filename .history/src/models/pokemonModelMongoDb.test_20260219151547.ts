import * as model from "./pokemonModelMongoDb.js";
const utils = require("../utilitiesAsync");
const dbFile = "./data/pokemonTest.json"; // Since this will be used by utilitiesAsync.js, need '.', not '..’
const { InvalidInputError } = require("../models/InvalidInputError");

const pokemonData: model.Pokemon[] = [
  { name: "Bulbasaur", type: "Grass" },
  { name: "Charmander", type: "Fire" },
  { name: "Squirtle", type: "Water" },
  { name: "Pikachu", type: "Electric" },
  { name: "Pidgeotto", type: "Psychic" },
  { name: "Koffing", type: "Normal" },
  { name: "Butterfree", type: "Bug" },
  { name: "Ekans", type: "Poison" },
  { name: "Sandshrew", type: "Ground" },
  { name: "Vulpix", type: "Fire" },
  { name: "Jigglypuff", type: "Normal" },
  { name: "Zubat", type: "Poison" },
  { name: "Oddish", type: "Grass" },
  { name: "Diglett", type: "Ground" },
  { name: "Meowth", type: "Normal" },
  { name: "Psyduck", type: "Water" },
  { name: "Mankey", type: "Fighting" },
  { name: "Growlithe", type: "Fire" },
  { name: "Poliwag", type: "Water" },
  { name: "Abra", type: "Psychic" },
  { name: "Machop", type: "Fighting" },
  { name: "Geodude", type: "Rock" },
  { name: "Ponyta", type: "Fire" },
  { name: "Magnemite", type: "Electric" },
  { name: "Gengar", type: "Ghost" },
  { name: "Eevee", type: "Normal" },
];

const generatePokemonData = () =>
  pokemonData.splice(Math.floor(Math.random() * pokemonData.length), 1)[0];

beforeEach(async () => {
  try {
    await utils.writeToJsonFile(dbFile, []);
  } catch (err) {}
});

const dbName = "pokemon_db_test"

beforeEach(async () => {
   try {
       await model.initialize(dbName, true);
     } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log("An unknown error occurred.");
        }
     }
  });

  afterEach(async () => {
   await model.close()
});



test('Can add Pokemon to DB', async () => {
    const newPokemon : model.Pokemon = generatePokemonData()!;
    await model.addPokemon(newPokemon.name, newPokemon.type);

    const cursor = await model.getCollection().find();
    const results = await cursor.toArray();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0]!.name.toLowerCase() == newPokemon.name.toLowerCase()).toBe(true);
    expect(results[0]!.type.toLowerCase() == newPokemon.type.toLowerCase()).toBe(true);
});


//AddPokemon tests

test("Add 2 pokemon, expect 2 new entries in the database", async () => {
  const dataBefore = await utils.readFromJsonFile(dbFile);
  const lengthBefore = dataBefore.length;

  const pokemon1: model.Pokemon = generatePokemonData()!;
  const pokemon2: model.Pokemon = generatePokemonData()!;

  await model.addPokemon(pokemon1.name, pokemon1.type);
  await model.addPokemon(pokemon2.name, pokemon2.type);

  const dataAfter = await utils.readFromJsonFile(dbFile);
  expect(dataAfter.length).toEqual(lengthBefore + 2);
});

test("AddPokemon: Adds a pokemon without validation", async () => {
  const newPokemon: model.Pokemon = generatePokemonData()!;
  const result = await model.addPokemon(newPokemon.name, newPokemon.type);

  const data = await utils.readFromJsonFile("./data/pokemonDatabase.json");

  expect(result.name).toBe(newPokemon.name);
  expect(result.type).toBe(newPokemon.type);

  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBe(1);
  expect(data[0].name.toLowerCase() == newPokemon.name.toLowerCase()).toBe(true);
  expect(data[0].type.toLowerCase() == newPokemon.type.toLowerCase()).toBe(true);
});
