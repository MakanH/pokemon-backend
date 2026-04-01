const dbName: string = "pokemon_db";
import { MongoError, Db, MongoClient, Collection } from "mongodb";
import type { Document } from "mongodb";
import { isValid } from "./validateUtils.js";
let client: MongoClient;
let pokemonsCollection: Collection<Pokemon> | undefined;
import { InvalidInputError } from "./InvalidInputError.js";
import { DatabaseError } from "./DatabaseError.js";

/**
 * Connect up to the online MongoDb database with the name stored in dbName
 */
async function initialize(): Promise<void> {
  try {
    const url = `${process.env.URL_PRE}${process.env.MONGODB_PWD}${process.env.URL_POST}`;
    client = new MongoClient(url); // store connected client for use while the app is running
    await client.connect();
    console.log("Connected to MongoDb");
    const db: Db = client.db(dbName);
    pokemonsCollection = db.collection("pokemons"); // convenient access to collection
  } catch (err) {
    if (err instanceof MongoError) {
      console.error("MongoDB connection failed:", err.message);
    } else {
      console.error("Unexpected error:", err);
    }
  }
}

interface Pokemon {
  name: string;
  type: string;
}

async function addPokemon(name: string, type: string): Promise<Pokemon> {
  const newPokemon: Pokemon = { name: name, type: type };
  if (pokemonsCollection == null)
    throw new DatabaseError("pokemonsCollection is undefined;");
  if (isValid(name, type)) {
    await pokemonsCollection.insertOne(newPokemon);
    return newPokemon;
  } else throw new InvalidInputError("Invalid name/type");
}

function getSinglePokemon(name: string) {
const foundPokemon: Pokemon = 
}

export { initialize };
export type { Pokemon };
export { addPokemon };
