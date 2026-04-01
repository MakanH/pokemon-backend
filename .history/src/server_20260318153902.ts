import { setServers } from "node:dns";
import * as model from "./models/pokemonModelMongoDb.js";
import app from "./app.js";

setServers(["8.8.8.8", "1.1.1.1"]);
const port: number = 1339;
const url = `${process.env.URL_PRE}${process.env.MONGODB_PWD}${process.env.URL_POST}`;

model
  .initialize("pokemon_db", false, url)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch((error: Error) => {
    console.error("Error initializing the database:", error);
  });
