import "dotenv/config";
import { setServers } from "node:dns";
import * as model from "./models/pokemonModelMongoDb.js";
import app from "./app.js";
setServers(["8.8.8.8", "1.1.1.1"]);
const port = 1339;
if (!process.env.URL_PRE || !process.env.MONGODB_PWD || !process.env.URL_POST) {
    console.error("Missing required env vars: URL_PRE, MONGODB_PWD, URL_POST. Create a .env file in the project root.");
    process.exit(1);
}
const url = `${process.env.URL_PRE}${process.env.MONGODB_PWD}${process.env.URL_POST}`;
model
    .initialize("pokemon_db", false, url)
    .then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
})
    .catch((error) => {
    console.error("Error initializing the database:", error);
});
//# sourceMappingURL=server.js.map