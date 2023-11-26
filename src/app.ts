import express from "express";
import logger from "./utils/core/logger";
import connectToDb from "./utils/core/db";
import App from "./utils/core/server"



const app = new App()
app.listen()