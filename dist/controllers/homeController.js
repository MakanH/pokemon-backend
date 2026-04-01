import express from "express";
const router = express.Router();
const routeRoot = "/";
router.get("/", showHome);
function showHome(request, response) {
    response.status(200);
    response.send("Welcome to our cool website.");
}
export { router, routeRoot };
//# sourceMappingURL=homeController.js.map