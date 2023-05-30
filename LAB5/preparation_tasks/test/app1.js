import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* ********************************************** */
/* Determining the contents of the middleware stack *
/* ********************************************** */
app.use(morgan("dev")); // Place an HTTP request recorder on the stack — each request will be logged in the console in 'dev' format
app.use(express.static(__dirname + "/public")); // Place the built-in middleware 'express.static' — static content (files .css, .js, .jpg, etc.) will be provided from the 'public' directory
app.use(express.urlencoded({ extended: false }));
/* ****** */
/* "Routes" */
/* ****** */
/* ---------------- */
/* Route "GET('/')" */
/* ---------------- */
app.get("/", function (request, response) {
  // Generating the form if the relative URL is '/', and the GET method was used to send data to the server'
  console.log(__dirname + "/public");
  response.send(`
   <!DOCTYPE html>
   <html lang="en">
      <head>
         <meta charset="utf-8">
         <meta name="viewport" content="width=device-width, initial-scale=1">
         <title>First Express application</title>
      </head>
      <body>
         <main>
            <h1>First Express application</h1>
            <form method="GET" action="/submit">
               <label for="name">Give your name</label>
               <input name="name">
               <br>
               <input type="submit">
               <input type="reset">
            </form>
            <img src = "/img/sigma.jpeg" alt = "wwe" width='200' height='200'>
         </main>
      </body>
   </html>   
          `); // Send the response to the browser
});
/* ---------------------- */
/* Route "GET('/submit')" */
/* ---------------------- */
app.get("/submit", function (request, response) {
  response.set("Content-Type", "text/plain");
  response.send(`Hello ${request.query.name}`); // Send a response to the browser
});
/* ********************************************** */

app.post("/", function (request, response) {
  response.set("Content-Type", "text/plain");
  response.send(`Hello ${request.body.name}`);
});

// The application is to listen on port number 8000
app.listen(8000, function () {
  console.log("The server was started on port 8000");
  console.log('To stop the server, press "CTRL + C"');
});
