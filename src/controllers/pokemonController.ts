import express from "express";
import type { Request, Response } from "express";
import * as model from "../models/pokemonModelMongoDb.js";
import { DatabaseError } from "../models/DatabaseError.js";
import { InvalidInputError } from "../models/InvalidInputError.js";

const router = express.Router();
const routeRoot = "/pokemons";

router.get("/:name", readPokemon);
router.post("/", createPokemon);

async function readPokemon(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const name = request.params.name as string;

    if (!name) {
      response.status(400).send("Bad Request: Please provide a pokemon name.");
      return;
    }

    const foundPokemon = await model.getSinglePokemon(name);
    response
      .status(200)
      .send(
        `Successfully found pokemon. Name: ${foundPokemon.name}, Type: ${foundPokemon.type}`,
      );
  } catch (error) {
    // Inline Error Handling
    if (error instanceof InvalidInputError) {
      response.status(400).send(`User Error: ${error.message}`);
    } else if (error instanceof DatabaseError) {
      if (error.message.includes("Couldn't find")) {
        response.status(404).send(`Not Found: ${error.message}`);
      } else {
        response.status(500).send(`System Error: ${error.message}`);
      }
    } else if (error instanceof Error) {
      response.status(500).send(`System Error: ${error.message}`);
    } else {
      response.status(500).send("An unknown error occurred.");
    }
  }
}

async function createPokemon(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const { name, type } = request.body;
    const newPokemon = await model.addPokemon(name, type);
    response
      .status(201)
      .send(
        `Successfully added pokemon. Name: ${newPokemon.name}, Type: ${newPokemon.type}`,
      );
  } catch (error) {
    if (error instanceof InvalidInputError) {
      response.status(400).send(`User Error: ${error.message}`);
    } else if (error instanceof DatabaseError) {
      if (error.message.includes("Couldn't find")) {
        response.status(404).send(`Not Found: ${error.message}`);
      } else {
        response.status(500).send(`System Error: ${error.message}`);
      }
    } else if (error instanceof Error) {
      response.status(500).send(`System Error: ${error.message}`);
    } else {
      response.status(500).send("An unknown error occurred.");
    }
  }
}

export { router, routeRoot };
