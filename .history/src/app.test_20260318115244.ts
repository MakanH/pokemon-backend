import * as model from "./models/pokemonModelMongoDb.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "./app.js";
import supertest from "supertest";
const testRequest = supertest(app);

let mongod: MongoMemoryServer;

const pokemonData: model.Pokemon[] = [
  { name: "Bulbasaur", type: "Grass" },
  { name: "Ivysaur", type: "Grass" },
  { name: "Venusaur", type: "Grass" },
  { name: "Charmander", type: "Fire" },
  { name: "Charmeleon", type: "Fire" },
  { name: "Charizard", type: "Fire" },
  { name: "Squirtle", type: "Water" },
  { name: "Wartortle", type: "Water" },
  { name: "Blastoise", type: "Water" },
  { name: "Pikachu", type: "Electric" },
  { name: "Raichu", type: "Electric" },
  { name: "Electabuzz", type: "Electric" },
  { name: "Abra", type: "Psychic" },
  { name: "Kadabra", type: "Psychic" },
  { name: "Alakazam", type: "Psychic" },
  { name: "Eevee", type: "Normal" },
  { name: "Snorlax", type: "Normal" },
  { name: "Meowth", type: "Normal" },
  { name: "Persian", type: "Normal" },
  { name: "Pidgey", type: "Normal" },
];

const generatePokemonData = () =>
  pokemonData.splice(Math.floor(Math.random() * pokemonData.length), 1)[0];
const dbName = "pokemon_db_test";
jest.setTimeout(5000);

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  console.log("Mock database started");
});

afterAll(async () => {
  await mongod.stop();
  console.log("Mock database stopped");
});

beforeEach(async () => {
  try {
    const url: string = mongod.getUri();
    await model.initialize(dbName, true, url);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log("An unknown error occurred.");
    }
  }
});

afterEach(async () => {
  await model.close();
});
