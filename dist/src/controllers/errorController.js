import express from "express";
const router = express.Router();
const routeRoot = "/";
router.use(handleError);
function handleError(request, response) {
    response.status(404);
    response.send("Invalid URL entered.  Please try again.");
}
export { router, routeRoot };
//# sourceMappingURL=errorController.js.map