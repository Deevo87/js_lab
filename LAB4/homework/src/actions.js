import http from "http";
import fs, { writeFile } from "fs";
import path, { parse, resolve } from "path";
import { error } from "console";

export const loadTemplate = (request, response, src_path) => {
  const url = request.url;
  let template_path = path.join(src_path, url);

  if (url === "/favicon.ico") {
    response.end();
  } else if (url.endsWith(".css") || url.endsWith(".js")) {
    template_path = path.join(src_path, "views/home", url);
  } else if (url === "/") {
    template_path = path.join(src_path, "views/home/home.html", url);
  }

  fs.readFile(template_path, "utf8", (err, data) => {
    if (err) {
      console.log("Can not find file: ", err);
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.end("Internal server error.");
    } else {
      if (url.endsWith(".css")) {
        response.writeHead(200, { "Content-Type": "text/css" });
      } else if (url.endsWith(".js")) {
        response.writeHead(200, { "Content-Type": "text/js" });
      } else {
        response.writeHead(200, { "Content-Type": "text/html" });
      }
      response.end(data);
    }
  });
};

export const loadImg = (request, response, src_path) => {
  const url = request.url;
  let template_path = path.join(src_path, "views/home", url);

  fs.readFile(template_path, "utf8", (err, data) => {
    if (err) {
      console.log("Can not find file: ", err);
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.end("Internal server error.");
    } else {
      response.writeHead(200, { "Content-Type": "image/jpeg" });
      response.end(data);
    }
  });
};

const connectToDB = async () => {
  const promise = await new Promise((resolve, rejcet) => {
    fs.readFile("./data/clients.json", "utf-8", (err, data) => {
      if (err) {
        console.log("Can not connect to database.");
        rejcet(err);
        return;
      }
      console.log("Connected to database");
      const db = JSON.parse(data);
      resolve(db);
    });
  });
  return promise;
};

const saveJSON = (toSave) => {
  const updated = JSON.stringify(toSave, null, 2);
  fs.writeFileSync("./data/clients.json", updated, "utf-8", (err) => {
    if (err) {
      console.error("Failed to write to file: ", err);
      return;
    }
    console.log("Database has been updated.");
  });
};

export const performTransfer = async (request, response, parsed) => {
  console.log(parsed);
  const db = await connectToDB()
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error connecting to database: ", error);
      throw error;
    });
  if (parsed.get("action") === "withdraw_btn") {
    console.log("wypłata");
    withdraw(request, response, parsed, db);
  } else if (parsed.get("action") === "deposit_btn") {
    console.log("wpłata");
    deposit(request, response, parsed, db);
  }
  response.writeHead(302, { Location: "/" });
  response.end();
};

//data is hardcoded
const withdraw = (request, response, parsed, db) => {
  if (db[0].account.type !== parsed.get("accountType")) {
    console.error(
      "You do not have account of given type: ",
      parsed.get(accountType)
    );
    return;
  }

  let acc_balance = parseInt(db[0].account.balance);
  let amount = parseInt(parsed.get("amount"));

  if (acc_balance - amount < 0) {
    console.log("There are not enough funds in the account: ", acc_balance);
    throw error;
  }
  db[0].account.balance -= amount;
  db[0].account.subaccounts.find((subaccount) => {
    if (subaccount.currency === parsed.get("subaccountType")) {
      subaccount.balance += amount;
    }
  });
  saveJSON(db);
};

const deposit = (request, response, parsed, db) => {
  if (db[0].account.type !== parsed.get("accountType")) {
    console.error(
      "You do not have account of given type: ",
      parsed.get(accountType)
    );
    return;
  }
  let exist = false;
  let amount = parseInt(parsed.get("amount"));
  db[0].account.subaccounts.find((subaccount) => {
    console.log(subaccount, parsed.get("subaccountType"));
    if (subaccount.currency === parsed.get("subaccountType")) {
      if (subaccount.balance - amount >= 0) {
        console.log("co do chuja");
        subaccount.balance -= amount;
        exist = true;
        return;
      } else {
        console.error("There is no enough funds on the subaccount.");
        throw error;
      }
    }
  });

  if (!exist) {
    console.error("There is no such subaccount");
    throw error;
  }

  db[0].account.balance += amount;
  saveJSON(db);
};
