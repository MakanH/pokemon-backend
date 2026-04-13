import { Collection } from "mongodb";
interface Pokemon {
    name: string;
    type: string;
}
/**
 * Connect up to the online MongoDb database with the name stored.
 * @param dbFilename The database to access.
 * @param resetFlag Flag stating whether to reset the database.
 * @param url The url of the collection to use.
 */
declare function initialize(dbFilename: string, resetFlag: boolean, url: string): Promise<void>;
/**
 * Handle closing of the MongoDB database connection.
 */
declare function close(): Promise<void>;
/**
 * Adding a pokemon to the database if it has a valid name and type.
 * @param name The new pokemon's name.
 * @param type The new pokemon's type.
 * @returns The added pokemon if it was successfully added.
 */
declare function addPokemon(name: string, type: string): Promise<Pokemon>;
/**
 * Gets a pokemon based on the passed name. Returns the first if there are duplicates.
 * @param name The name of the pokemon to find.
 * @returns The found pokemon, if it is present in the database.
 */
declare function getSinglePokemon(name: string): Promise<Pokemon>;
/**
 * Get all pokemons from the MongoDB database.
 * @returns All pokemon objects from the database.
 */
declare function getAllPokemons(): Promise<Pokemon[]>;
/**
 * Update a pokemon's type or name, accessing it through its original name and type.
 * @param name The name of the pokemon to edit.
 * @param type The type of the pokemon to edit.
 * @param newName The new name of the pokemon.
 * @param newType The new type of the pokemon.
 * @returns The updated pokemon's new name and type if it was found and updated successfully.
 */
declare function updatePokemon(name: string, type: string, newName: string, newType: string): Promise<Pokemon>;
/**
 * Delete a pokemon from the MongoDB database. Deletes the first pokemon found, even if duplicates are present.
 * @param name The name of the pokemon to delete.
 * @param type The type of the pokemon to delete.
 * @returns The name and type of the deleted pokemon if it was found and deleted successfully.
 */
declare function deletePokemon(name: string, type: string): Promise<Pokemon>;
/**
 * Function used only for unit testing purposes.
 * @returns A collection of all pokemon objects.
 */
declare function getCollection(): Collection<Pokemon>;
export { initialize, close, addPokemon, getSinglePokemon, getAllPokemons, updatePokemon, deletePokemon, getCollection, };
export type { Pokemon };
//# sourceMappingURL=pokemonModelMongoDb.d.ts.map