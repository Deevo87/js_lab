import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

/* *************************** */
/* Configuring the application */
/* *************************** */
const clientViewRouter = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

clientViewRouter.use(morgan("dev"));
clientViewRouter.use(express.static(__dirname + "/public/client"));
clientViewRouter.use(express.urlencoded({ extended: false }));

clientViewRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public" + "/client/home.html"));
});

let login = "johndoe" //login shardkodowany

clientViewRouter.get("/transfer", (request, response) => {
  console.log(request.body);
  const {
    amoutnt,
    accountType,
    subaccountType,
    action
  } = request.body;

  if (action === "withdraw_btn") {

  } else if (action === "deposit_btn") {
    
  }
})

const connectToDB = async () => {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    await client.connect();
    console.log("Połączono z bazą danych ...");

    return client;
  } catch {
    console.error("Błąd podczas łączenie z bazą danych.");
    throw error;
  }
};

const getData = async (log) => {
  //szukam po loginie bo jest unikalny
  let client, db;
  try {
    client = await connectToDB();
    db = client.db("AGH");
  } catch (error) {
    throw error;
  }

  if (log === "") {
    throw error("Nie wyszukano nikogo bez loginu.");
  }

  const collection = db.collection("clients");
  let result = await collection.find({ login: log }).toArray();
  client.close();
  return result;
};

export default clientViewRouter;
