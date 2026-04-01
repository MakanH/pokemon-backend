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
    let collectionCursor = db.listCollections({ name: "pokemons" });
    let collectionArray = await collectionCursor.toArray();
    if (collectionArray.length == 0) {
      const collation = { locale: "en", strength: 1 };
      await db.createCollection("pokemons", { collation: collation });
    }

    pokemonsCollection = db.collection<Pokemon>("pokemons"); // convenient access to collection
  } catch (err: any) {
    if (err instanceof MongoError) {
      console.error("MongoDB connection failed:", err.message);
    } else {
      throw new DatabaseError("Initialization failed: " + err);
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
    throw new DatabaseError("pokemonsCollection is undefined");
  if (isValid(name, type)) {
    await pokemonsCollection.insertOne(newPokemon);
    return newPokemon;
  } else throw new InvalidInputError("Invalid name/type");
}

async function getSinglePokemon(name: string): Promise<Pokemon> {
  if (pokemonsCollection == null)
    throw new DatabaseError("pokemonsCollection is undefined");
  const collation = { locale: "en", strength: 1 };
  const foundPokemon = await pokemonsCollection.findOne(
    { name: name },
    { collation: collation },
  );
  if (foundPokemon) return foundPokemon;
  else throw new InvalidInputError(`Pokemon ${name} not found`);
}

async function getAllPokemons(): Promise<Pokemon[]> {
  if (pokemonsCollection == null)
    throw new DatabaseError("pokemonsCollection is undefined");
  const cursor = await pokemonsCollection.find<Pokemon>({});
  return cursor.toArray();
}

export { initialize, addPokemon, getSinglePokemon, getAllPokemons };
export type { Pokemon };
