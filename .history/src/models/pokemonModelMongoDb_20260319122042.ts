import { MongoError, Db, MongoClient, Collection } from "mongodb";
import type { Document } from "mongodb";
import { isValid } from "./validateUtils.js";
import { DatabaseError } from "./DatabaseError.js";
import { InvalidInputError } from "./InvalidInputError.js";
import logger from "../logger.js"

interface Pokemon {
  name: string;
  type: string;
}

let client: MongoClient;
let pokemonsCollection: Collection<Pokemon> | undefined;

/**
 * Connect up to the online MongoDb database with the name stored.
 * @param dbFilename The database to access.
 * @param resetFlag Flag stating whether to reset the database.
 * @param url The url of the collection to use.
 */
async function initialize(
  dbFilename: string,
  resetFlag: boolean,
  url: string,
): Promise<void> {
  try {
    client = new MongoClient(url); // store connected client for use while the app is running
    await client.connect();
    logger.info("Connected to MongoDb");
    const db: Db = client.db(dbFilename);
    let collectionCursor = db.listCollections({ name: "pokemons" });
    let collectionArray = await collectionCursor.toArray();

    if (resetFlag && collectionArray.length > 0) {
      await db.collection("pokemons").drop();
    }

    if (collectionArray.length == 0) {
      // collation specifying case-insensitive collection
      const collation = { locale: "en", strength: 1 };
      // No match was found, so create new collection
      await db.createCollection("pokemons", { collation: collation });
    }
    pokemonsCollection = db.collection<Pokemon>("pokemons");
  } catch (err) {
    if (err instanceof MongoError) {
      logger.error("MongoDB connection failed");
    } else {
      logger.error("Unexpected error");
      throw new DatabaseError(`Unexpected error: ${err}`);
    }
  }
}

/**
 * Handle closing of the MongoDB database connection.
 */
async function close() {
  try {
    await client.close();
    console.log("MongoDb connection closed");
  } catch (err: unknown) {
    if (err instanceof Error) console.log(err.message);
    else console.log("Unknown error during beforeEach in unit tests");
  }
}

/**
 * Adding a pokemon to the database if it has a valid name and type.
 * @param name The new pokemon's name.
 * @param type The new pokemon's type.
 * @returns The added pokemon if it was successfully added.
 */
async function addPokemon(name: string, type: string): Promise<Pokemon> {
  isValid(name, type);

  if (!pokemonsCollection)
    throw new DatabaseError(
      "Error when adding pokemon - Collection not initialized",
    );

  try {
    const pokemonToAdd: Pokemon = { name: name, type: type };
    console.log(
      `Inserted pokemon ${(await pokemonsCollection.insertOne(pokemonToAdd)).insertedId}`,
    );
    return pokemonToAdd;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Unexpected error: ${error.message}`);
      throw new DatabaseError(`Unexpected error: ${error.message}`);
    }
    throw new DatabaseError(`Unexpected error: Unknown error`);
  }
}

/**
 * Gets a pokemon based on the passed name. Returns the first if there are duplicates.
 * @param name The name of the pokemon to find.
 * @returns The found pokemon, if it is present in the database.
 */
async function getSinglePokemon(name: string): Promise<Pokemon> {
  if (!pokemonsCollection)
    throw new DatabaseError(
      "Error when getting a pokemon - Collection not initialized",
    );

  try {
    const found = await pokemonsCollection.findOne<Pokemon>({ name: name });
    if (!found) throw new DatabaseError(`Couldn't find pokemon ${name}`);
    return found;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `Unexpected error when getting a pokemon: ${error.message}`,
      );
      throw new DatabaseError(
        `Unexpected error when getting a pokemon: ${error.message}`,
      );
    }
    throw new DatabaseError("Unknown error when getting a pokemon");
  }
}

/**
 * Get all pokemons from the MongoDB database.
 * @returns All pokemon objects from the database.
 */
async function getAllPokemons(): Promise<Pokemon[]> {
  if (!pokemonsCollection)
    throw new DatabaseError(
      "Error when getting all pokemon - Collection not initialized",
    );

  try {
    return await await pokemonsCollection.find<Pokemon>({}).toArray();
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `Unexpected error when getting all pokemon: ${error.message}`,
      );
      throw new DatabaseError(
        `Unexpected error when getting all pokemon: ${error.message}`,
      );
    }
    throw new DatabaseError("Unknown error when getting all pokemon");
  }
}

/**
 * Update a pokemon's type or name, accessing it through its original name and type.
 * @param name The name of the pokemon to edit.
 * @param type The type of the pokemon to edit.
 * @param newName The new name of the pokemon.
 * @param newType The new type of the pokemon.
 * @returns The updated pokemon's new name and type if it was found and updated successfully.
 */
async function updatePokemon(
  name: string,
  type: string,
  newName: string,
  newType: string,
): Promise<Pokemon> {
  isValid(newName, newType);

  if (!pokemonsCollection)
    throw new DatabaseError(
      "Error when updating pokemon - Collection not initialized",
    );

  try {
    const result = await pokemonsCollection.updateOne(
      { name: name, type: type },
      { $set: { name: newName, type: newType } },
    );
    if (result.matchedCount === 0) {
      throw new DatabaseError(
        `Couldn't find pokemon ${name} with type ${type}`,
      );
    }
    console.log(`Updated pokemon ${name} to ${newName}`);
    return { name: newName, type: newType };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Unexpected error when updating pokemon: ${error.message}`);
      throw new DatabaseError(
        `Unexpected error when updating pokemon: ${error.message}`,
      );
    }
    throw new DatabaseError("Unknown error when updating pokemon");
  }
}

/**
 * Delete a pokemon from the MongoDB database. Deletes the first pokemon found, even if duplicates are present.
 * @param name The name of the pokemon to delete.
 * @param type The type of the pokemon to delete.
 * @returns The name and type of the deleted pokemon if it was found and deleted successfully.
 */
async function deletePokemon(name: string, type: string): Promise<Pokemon> {
  if (!pokemonsCollection)
    throw new DatabaseError(
      "Error when deleting pokemon - Collection not initialized",
    );

  try {
    const result = await pokemonsCollection.deleteOne({
      name: name,
      type: type,
    });
    if (result.deletedCount === 0) {
      throw new DatabaseError(
        `Couldn't find pokemon ${name} with type ${type}`,
      );
    }
    console.log(`Deleted pokemon ${name}`);
    return { name: name, type: type };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Unexpected error when deleting pokemon: ${error.message}`);
      throw new DatabaseError(
        `Unexpected error when deleting pokemon: ${error.message}`,
      );
    }
    throw new DatabaseError("Unknown error when deleting pokemon");
  }
}

/**
 * Function used only for unit testing purposes.
 * @returns A collection of all pokemon objects.
 */
function getCollection(): Collection<Pokemon> {
  if (!pokemonsCollection) {
    throw new DatabaseError(
      "Collection is not defined.  Db should have been initialized properly before use.",
    );
  }
  return pokemonsCollection;
}

export {
  initialize,
  close,
  addPokemon,
  getSinglePokemon,
  getAllPokemons,
  updatePokemon,
  deletePokemon,
  getCollection,
};
export type { Pokemon };
