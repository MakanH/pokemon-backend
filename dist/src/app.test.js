import * as model from "./models/pokemonModelMongoDb.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "./app.js";
import supertest from "supertest";
import { test, expect, beforeAll, afterAll, beforeEach, afterEach, } from "vitest";
const testRequest = supertest(app);
let mongod;
const pokemonData = [
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
const generatePokemonData = () => pokemonData.splice(Math.floor(Math.random() * pokemonData.length), 1)[0];
const dbName = "pokemon_db_test";
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
        const url = mongod.getUri();
        await model.initialize(dbName, true, url);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        else {
            console.log("An unknown error occurred.");
        }
    }
});
afterEach(async () => {
    await model.close();
});
test("GET /pokemons success case", async () => {
    const newPokemon = generatePokemonData();
    await model.addPokemon(newPokemon.name, newPokemon.type);
    const testResponse = await testRequest.get("/pokemons/" + newPokemon.name);
    expect(testResponse.status).toBe(200);
});
test("POST /pokemons success case", async () => {
    const newPokemon = generatePokemonData();
    const testResponse = await testRequest.post("/pokemons").send({
        name: newPokemon.name,
        type: newPokemon.type,
    });
    expect(testResponse.status).toBe(201);
    const cursor = await model.getCollection().find();
    const results = await cursor.toArray();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].name.toLowerCase() == newPokemon.name.toLowerCase()).toBe(true);
    expect(results[0].type.toLowerCase() == newPokemon.type.toLowerCase()).toBe(true);
});
test("POST /pokemons failure case (400 Invalid Input)", async () => {
    const testResponse = await testRequest.post("/pokemons").send({
        name: "Gengar",
        type: "Ghost",
    });
    expect(testResponse.status).toBe(400);
});
test("GET /pokemons failure case (500 System Error)", async () => {
    await model.close();
    const testResponse = await testRequest.get("/pokemons/Pikachu");
    expect(testResponse.status).toBe(500);
});
//# sourceMappingURL=app.test.js.map