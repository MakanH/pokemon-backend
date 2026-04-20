import express from "express";
import * as model from "../models/pokemonModelMongoDb.js";
import { DatabaseError } from "../models/DatabaseError.js";
import { InvalidInputError } from "../models/InvalidInputError.js";
const router = express.Router();
const routeRoot = "/pokemons";
router.get("/:name", readPokemon);
router.post("/", createPokemon);
router.put("/", updatePokemon);
async function readPokemon(request, response) {
    try {
        const name = request.params.name;
        if (!name) {
            response
                .status(400)
                .send({ errorMessage: "Bad Request: Please provide a pokemon name." });
            return;
        }
        const foundPokemon = await model.getSinglePokemon(name);
        response.status(200).send(foundPokemon);
    }
    catch (error) {
        // Inline Error Handling
        if (error instanceof InvalidInputError) {
            response
                .status(400)
                .send({ errorMessage: `User Error: ${error.message}` });
        }
        else if (error instanceof DatabaseError) {
            if (error.message.includes("Couldn't find")) {
                response
                    .status(404)
                    .send({ errorMessage: `Not Found: ${error.message}` });
            }
            else {
                response
                    .status(500)
                    .send({ errorMessage: `System Error: ${error.message}` });
            }
        }
        else if (error instanceof Error) {
            response
                .status(500)
                .send({ errorMessage: `System Error: ${error.message}` });
        }
        else {
            response.status(500).send({ errorMessage: "An unknown error occurred." });
        }
    }
}
async function createPokemon(request, response) {
    try {
        const { name, type } = request.body;
        const newPokemon = await model.addPokemon(name, type);
        response.status(201).send(newPokemon);
    }
    catch (error) {
        if (error instanceof InvalidInputError) {
            response
                .status(400)
                .send({ errorMessage: `User Error: ${error.message}` });
        }
        else if (error instanceof DatabaseError) {
            if (error.message.includes("Couldn't find")) {
                response
                    .status(404)
                    .send({ errorMessage: `Not Found: ${error.message}` });
            }
            else {
                response
                    .status(500)
                    .send({ errorMessage: `System Error: ${error.message}` });
            }
        }
        else if (error instanceof Error) {
            response
                .status(500)
                .send({ errorMessage: `System Error: ${error.message}` });
        }
        else {
            response.status(500).send({ errorMessage: "An unknown error occurred." });
        }
    }
}
async function updatePokemon(request, response) {
    try {
        const { oldName, oldType, newName, newType } = request.body;
        const updatedPokemon = await model.updatePokemon(oldName, oldType, newName, newType);
        response.status(200).send(updatedPokemon);
    }
    catch (error) {
        if (error instanceof InvalidInputError) {
            response
                .status(400)
                .send({ errorMessage: `User Error: ${error.message}` });
        }
        else if (error instanceof DatabaseError) {
            if (error.message.includes("Couldn't find")) {
                response
                    .status(404)
                    .send({ errorMessage: `Not Found: ${error.message}` });
            }
            else {
                response
                    .status(500)
                    .send({ errorMessage: `System Error: ${error.message}` });
            }
        }
        else if (error instanceof Error) {
            response
                .status(500)
                .send({ errorMessage: `System Error: ${error.message}` });
        }
        else {
            response.status(500).send({ errorMessage: "An unknown error occurred." });
        }
    }
}
export { router, routeRoot };
//# sourceMappingURL=pokemonController.js.map