import { Router } from "express";
import { listPublicCategories } from "../controllers/category.controller.js";

const Categoryrouter = Router();

/* GET /api/categories — public list with counts */
Categoryrouter.get("/", listPublicCategories);

export default Categoryrouter;