"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userRouter = (0, express_1.Router)();
userRouter.post("/", userController_1.createUser);
userRouter.get("/", userController_1.getUsers);
userRouter.get("/:username", userController_1.getUser);
exports.default = userRouter;
