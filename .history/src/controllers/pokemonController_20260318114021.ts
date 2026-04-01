import express from "express";
import type { Request, Response } from "express";
import * as model from "../models/pokemonModelMongoDb.js";
import { DatabaseError } from "../models//DatabaseError.js";
import { InvalidInputError } from "../models/InvalidInputError.js";

const router = express.Router();
const routeRoot = "/pokemons";

router.post("/", addPokemon);
async function addPokemon(request: Request, response: Response): Promise<void> {
  try {
    const result: model.Pokemon = await model.addPokemon(
      request.body.name,
      request.body.type,
    );
    response.status(200);
    response.send(`Pokemon added: name=${result.name}, type=${result.type}`);
  } catch (error: unknown) {
    if (error instanceof InvalidInputError) {
      response.status(400);
      response.send("Invalid input: " + error.message);
    } else if (error instanceof DatabaseError) {
      response.status(500); // Database error might be a server-side issue
      response.send("Database error: " + error.message);
    } else {
      response.status(500); // Fallback for unknown errors
      response.send("An unexpected error occurred");
    }
  }
}

router.get("/:name", readPokemon);
async function readPokemon(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const name = request.params.name as string;

    if (!name) {
      response
        .status(400)
        .send(
          "Bad Request: Please provide a pokemon name in the query parameters.",
        );
      return;
    }

    const foundPokemon = await model.getSinglePokemon(name);

    response
      .status(200)
      .send(
        `Successfully found pokemon. Name: ${foundPokemon.name}, Type: ${foundPokemon.type}`,
      );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Couldn't find")) {
        response.status(404).send(error.message);
      } else {
        response.status(500).send(`Server error: ${error.message}`);
      }
    } else {
      response
        .status(500)
        .send("An unknown error occurred while finding the pokemon.");
    }
  }
}
export { router, routeRoot };
