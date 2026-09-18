import { Router } from "express";
import {
  adminListContacts,
  adminGetContact,
  adminUpdateContactStatus,
  adminDeleteContact,
  adminContactStats,
} from "../controllers/contact.admin.controller.js";

const Contactrouter = Router();

Contactrouter.get("/contacts/stats/summary", adminContactStats);
Contactrouter.get("/contacts", adminListContacts);
Contactrouter.get("/contacts/:id", adminGetContact);
Contactrouter.patch("/contacts/:id/status", adminUpdateContactStatus);
Contactrouter.delete("/contacts/:id", adminDeleteContact);

export default Contactrouter;