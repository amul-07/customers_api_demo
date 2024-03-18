import express from "express";
import customerRouter from "./customer";

const routes = express.Router();

routes.use("/customers", customerRouter);

export default routes;
