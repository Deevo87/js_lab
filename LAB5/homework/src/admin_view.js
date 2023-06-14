import express from "express";
import morgan from "morgan";
import path from "path";
import mongodb, { MongoClient } from "mongodb";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import Joi from "joi";
import { error } from "console";

/* *************************** */
/* Configuring the application */
/* *************************** */
const adminViewRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

adminViewRouter.use(morgan("dev"));
adminViewRouter.use(express.static(__dirname + "/public/admin"));
adminViewRouter.use(express.urlencoded({ extended: false }));
adminViewRouter.use(express.json());
// adminViewRouter.use(express.urlencoded({ extended: false }));
// adminViewRouter.use(bodyParser.json());

const userSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.min": "Imię musi mieć co najmiej 3 litery.",
      "string.pattern.base": "Imię może zawierać tylko litery alfabetu.",
      "string.empty": "Imię nie może być puste.",
      "any.required": "Imię jest wymagane.",
    }),
  lastName: Joi.string()
    .min(3)
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.min": "Nazwisko musi mieć co najmiej 3 litery.",
      "string.pattern.base": "Nazwisko może zawierać tylko litery alfabetu.",
      "string.empty": "Nazwisko nie może być puste.",
      "any.required": "Nazwisko jest wymagane.",
    }),
  login: Joi.string().min(3).required().messages({
    "string.min": "Login musi mieć co najmniej 3 litery.",
    "string.empty": "Login nie może być pusty.",
    "any.required": "Login jest wymagany.",
  }),
  password: Joi.string()
    .min(8)
    .max(16)
    .required()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,16}$/
    )
    .messages({
      "string.min": "Hasło musi mieć co najmniej 8 znaków.",
      "string.max": "Hasło nie może mieć więcej niż 16 znaków.",
      "string.empty": "Hasło nie może być puste.",
      "any.required": "Hasło jest wymagane.",
      "string.pattern.base":
        "Hasło musi zawierać co najmniej jedną małą literę, jedną wielką literę, jedną liczbę i jeden znak specjalny (!@#$%^&*()).",
    }),
  email: Joi.string()
    .email()
    .required()
    .regex(/@gmail\.com$/)
    .messages({
      "string.email": "Email musi być poprawnym adresem email.",
      "string.empty": "Email nie może być puste.",
      "any.required": "Email jest wymagane.",
      "string.pattern.base": 'Email musi mieć końcówkę "@gmail.com".',
    }),
  phone: Joi.string()
    .pattern(/^(?:\+48 )?\d{3}(?: \d{3}){2}$|^(?:\+48)?\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Telefon musi być w jednym z formatów: +48 999 999 999, 999 999 999, 123456789, +48 123456789, +48123456789, +48999 999 999.",
      "string.empty": "Telefon nie może być puste.",
      "any.required": "Telefon jest wymagane.",
    }),
  address: Joi.string().required().messages({
    "string.empty": "Adres nie może być puste.",
    "any.required": "Adres jest wymagany.",
  }),
  accountType: Joi.string().required().messages({
    "string.empty": "Rodzaj konta nie może być pusty.",
    "any.required": "Rodzaj konta jest wymagany.",
  }),
  subaccountType: Joi.string().required().messages({
    "string.empty": "Rodzaj subkonta nie może być pusty.",
    "any.required": "Rodzaj subkonta jest wymagany.",
  }),
});

adminViewRouter.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname + "/public" + "/admin/home.html"));
  const client = await getData("johndoe");
  console.log(client);
});

adminViewRouter.post("/create_account", (req, res) => {
  console.log(req.body);
  const {
    firstName,
    lastName,
    login,
    password,
    email,
    phone,
    address,
    accountType,
    subaccountType,
  } = req.body;
  console.log(address);
  const { error } = userSchema.validate(req.body);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  const newClient = {
    firstName,
    lastName,
    login,
    password,
    email,
    phone,
    address,
    account: {
      type: accountType,
      subaccounts: [
        {
          subaccountId: 1,
          currency: subaccountType,
          balance: 0,
        },
      ],
    },
  };

  addClient(newClient, res);
});

const addClient = async (newClient, res) => {
  try {
    let client, db;
    try {
      client = await connectToDB();
      db = client.db("AGH");
    } catch (error) {
      throw error;
    }

    const collection = db.collection("clients");
    await collection.insertOne(newClient);
    client.close();

    console.log("Dane zostały dodane do bazy danych.");
    res.json({
      message: "Dane zostały poprawnie zwalidowane i dodane do bazy danych.",
    });
  } catch (error) {
    console.error(
      "Podczas dodawania klienta do bazy danych wystąpił błąd:",
      error
    );
    res.status(500).json({
      error: "Wystąpił błąd podczas dodawania klienta do bazy danych.",
    });
  }
};

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

export default adminViewRouter;
