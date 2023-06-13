import express from "express";
import morgan from "morgan";
import path from "path";
import mongodb from "mongodb";
import { fileURLToPath } from "url";

const getData = async (fac = "") => {
  const MongoClient = mongodb.MongoClient;
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  await client.connect();
  const db = client.db("AGH");
  const collection = db.collection("students");
  const query = fac === "" ? {} : { faculty: fac };
  console.log(query);
  let students = await collection.find(query).toArray();
  client.close();
  return students;
};

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

app.get("/", async function (request, response) {
  let students = [];
  students = getData();
  response.render("index", { mode: true, students: students }); // Render the 'index' view
});

/* ********************************************** */

app.get("/faculty", async function (request, response) {
  let students = [];
  students = await getData(request.query.faculty);
  response.render("index", { mode: true, students: students });
});

/* ************************************************ */

app.listen(8000, function () {
  console.log("The server was started on port 8000");
  console.log('To stop the server, press "CTRL + C"');
});
