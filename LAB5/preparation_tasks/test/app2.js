import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

/* *************************** */
/* Configuring the application */
/* *************************** */
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", __dirname + "/views"); // Files with views can be found in the 'views' directory
app.set("view engine", "pug"); // Use the 'Pug' template system
app.locals.pretty = app.get("env") === "development"; // The resulting HTML code will be indented in the development environment

/* ************************************************ */

app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

/* ******** */
/* "Routes" */
/* ******** */

let students = [
  {
    fname: "Jan",
    lname: "Kowalski",
  },
  {
    fname: "Anna",
    lname: "Nowak",
  },
];

app.get("/", function (request, response) {
  response.render("index", { table: students }); // Render the 'index' view
});

app.get("/submit", function (request, response) {
  response.set("Content-Type", "text/plain");
  response.send(`Hello ${request.query.name}`); // Send a response to the browser
});
/* ********************************************** */

app.post("/", function (request, response) {
  response.set("Content-Type", "text/plain");
  response.send(`Hello ${request.body.name}`);
});

/* ************************************************ */

app.listen(8001, function () {
  console.log("The server was started on port 8000 HALO");
  console.log('To stop the server, press "CTRL + C"');
});
