import * as model from "./pokemonModelMongoDb.js";
const utils = require("../utilitiesAsync");
const dbFile = "./data/pokemonTest.json"; // Since this will be used by utilitiesAsync.js, need '.', not '..’
const { InvalidInputError } = require("../models/InvalidInputError");

const generatePokemonData = () =>
  model.Pokemon.splice(Math.floor(Math.random() * model.Pokemon.length), 1)[0];

beforeEach(async () => {
  try {
    await utils.writeToJsonFile(dbFile, []);
  } catch (err) {}
});

test("Can add pokemon to DB (external)", async () => {
  const { name, type } = generatePokemonData();

  expect(await model.addPokemon(name, type)).toEqual({
    name: name,
    type: type,
  });

  await expect(model.addPokemon("3mon2", type)).rejects.toThrow(
    InvalidInputError,
  );

  await expect(model.addPokemon(name, "Red Firework")).rejects.toThrow(
    InvalidInputError,
  );
});

//AddPokemon tests

test("Add 2 pokemon, expect 2 new entries in the database", async () => {
  const dataBefore = await utils.readFromJsonFile(dbFile);
  const lengthBefore = dataBefore.length;

  const pokemon1 = generatePokemonData();
  const pokemon2 = generatePokemonData();

  await model.addPokemon(pokemon1.name, pokemon1.type);
  await model.addPokemon(pokemon2.name, pokemon2.type);

  const dataAfter = await utils.readFromJsonFile(dbFile);
  expect(dataAfter.length).toEqual(lengthBefore + 2);
});

test("AddPokemon: Adds a pokemon without validation", async () => {
  const { name, type } = generatePokemonData();
  const result = await model.addPokemon(name, type);

  const data = await utils.readFromJsonFile("./data/pokemonDatabase.json");

  expect(result.name).toBe(name);
  expect(result.type).toBe(type);

  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBe(1);
  expect(data[0].name.toLowerCase() == name.toLowerCase()).toBe(true);
  expect(data[0].type.toLowerCase() == type.toLowerCase()).toBe(true);
});

