import express from "express";
import expressListEndpoints from "express-list-endpoints";
import expressListRoutes from "express-list-routes";
import pinohttp from "pino-http";
import logger from "./logger.js";
const app = express();
const httpLogger = pinohttp({
    logger: logger,
});
app.use(httpLogger);
// errorController must always be last in this list
const controllers = [
    "homeController.js",
    "pokemonController.js",
    "errorController.js",
];
app.use(express.json());
async function registerControllers() {
    for (const controllerName of controllers) {
        try {
            const controllerRoutes = await import(`./controllers/${controllerName}`);
            if (controllerRoutes &&
                controllerRoutes.routeRoot &&
                controllerRoutes.router) {
                app.use(controllerRoutes.routeRoot, controllerRoutes.router);
            }
            else {
                throw new Error(`Invalid controller format: ${controllerName}`);
            }
        }
        catch (error) {
            console.log(error);
            throw error; // Could fail gracefully, but this would hide bugs later on
        }
    }
}
await registerControllers();
console.log(expressListEndpoints(app));
expressListRoutes(app, { prefix: "/" });
export default app;
//# sourceMappingURL=app.js.map