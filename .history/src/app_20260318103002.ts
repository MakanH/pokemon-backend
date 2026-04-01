import express from "express";
const app = express();

// errorController must always be last in this list
const controllers: string[] = ["homeController.js", "errorController,js"];

app.use(express.json());

async function registerControllers() {
  for (const controllerName of controllers) {
    try {
      const controllerRoutes = await import(`./controllers/${controllerName}`);
      if (
        controllerRoutes &&
        controllerRoutes.routeRoot &&
        controllerRoutes.router
      ) {
        app.use(controllerRoutes.routeRoot, controllerRoutes.router);
      } else {
        throw new Error(`Invalid controller format: ${controllerName}`);
      }
    } catch (error) {
      console.log(error);
      throw error; // Could fail gracefully, but this would hide bugs later on
    }
  }
}

await registerControllers();

export default app;
