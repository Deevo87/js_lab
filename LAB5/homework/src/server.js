import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

import adminViewRouter from "./admin_view.js";
import clientViewRouter from "./client_view.js";

/* *************************** */
/* Configuring the application */
/* *************************** */
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin_view", adminViewRouter);
app.use("/client_view", clientViewRouter);

app.get("/", (req, res) => {
  res.redirect("/client_view");
});



app.listen(8000, function () {
  console.log("The server was started on port 8000");
  console.log('To stop the server, press "CTRL + C"');
});
