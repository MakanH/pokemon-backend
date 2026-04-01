import { createServer, IncomingMessage, ServerResponse } from "http";
import { addPokemon, getSinglePokemon, getAllPokemons, } from "./models/pokemonModelMongoDb.js";
const port = 1339;
import * as model from "./models/pokemonModelMongoDb.js";
let initialized = model.initialize();
createServer(async function (request, response) {
    await initialized;
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write(await handleAddPokemon("Charzard", "Fire"));
    response.write("\n");
    response.write(await handleGetSinglePokemon("charzard"));
    response.write("(Lower case successful)\n");
    response.write(await handleGetSinglePokemon("fvfsvfdsvfev"));
    response.write(await handleGetAllPokemons());
    response.end("\nHello World Makan");
}).listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
async function handleAddPokemon(name, type) {
    try {
        const result = await model.addPokemon(name, type);
        return `Success. Added ${result.name} with type ${result.type}`;
    }
    catch (err) {
        return "Failed to add pokemon";
    }
}
async function handleGetSinglePokemon(name) {
    try {
        const result = await model.getSinglePokemon(name);
        return `Success. Found ${result.name} with type ${result.type}`;
    }
    catch (err) {
        return "Failed to find pokemon";
    }
}
async function handleGetAllPokemons() {
    try {
        const result = await model.getAllPokemons();
        console.table(result);
        return `Success. Found ${result.length} pokemons`;
    }
    catch (err) {
        return "Failed to get all pokemons";
    }
}
//# sourceMappingURL=server.js.map