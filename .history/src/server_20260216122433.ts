import { createServer, IncomingMessage, ServerResponse } from "http";
import { addPokemon } from "./models/pokemonModelMongoDb.js";
const port: number = 1339;

import * as model from "./models/pokemonModelMongoDb.js";
let initialized = model.initialize();

createServer(async function (
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  await initialized;
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World <yourname>");
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

async function handleAddPokemon(name: string, type: string): Promise<string>{
  const result : model.Pokemon = await model.addPokemon(name, type);
  return 
}
