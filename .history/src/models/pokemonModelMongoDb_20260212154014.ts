const dbName : string = "pokemon_db";
import { MongoError, Db, MongoClient, Collection } from "mongodb";
import type {Document} from "mongodb";
import { isValid } from "./validateUtils.js";
let client : MongoClient;
let pokemonsCollection: Collection<Document> | undefined;

/**
 * Connect up to the online MongoDb database with the name stored in dbName
 */
async function initialize() : Promise<void>{
    try {
      const url = `${process.env.URL_PRE}${process.env.MONGODB_PWD}${process.env.URL_POST}`;
      client = new MongoClient(url); // store connected client for use while the app is running
      await client.connect(); 
      console.log("Connected to MongoDb");
      const db : Db = client.db(dbName);
      pokemonsCollection = db.collection("pokemons") // convenient access to collection
    } catch (err) {
        if (err instanceof MongoError) {
            console.error("MongoDB connection failed:", err.message);
          } else {
            console.error("Unexpected error:", err);
          }
    } 
}	

export { initialize }

