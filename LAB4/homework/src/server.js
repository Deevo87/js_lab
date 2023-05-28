import http from "node:http";
import { URL } from "node:url";
import * as actions from "./actions.js";

const requestListener = (request, response) => {
  console.log("--------------------------------------");
  console.log(`The relative URL of the current request: ${request.url}`);
  console.log(`Access method: ${request.method}`);
  console.log("--------------------------------------");
  const url = new URL(request.url, `http://${request.headers.host}`);

  //routes
  console.log(url.pathname);
  if (
    (url.pathname === "/" ||
      url.pathname === "/home.css" ||
      url.pathname === "/home.js") &&
    request.method === "GET"
  ) {
    actions.loadTemplate(request, response, "./");
  } else if (
    (url.pathname.endsWith(".jpg") || url.pathname.endsWith(".jpeg")) &&
    request.method === "GET"
  ) {
    actions.loadImg(request, response, "./");
  } else if (url.pathname === "/transfer" && request.method === "POST") {
    let buffer = "";

    request.on("data", (chunk) => {
      buffer += chunk;
    });

    request.on("end", () => {
      const parsed = new URLSearchParams(buffer);
      actions.performTransfer(request, response, parsed);
    });
  } else if (url.pathname === "/login" && request.method === "POST") {
    let buffer = "";

    request.on("data", (chunk) => {
      buffer += chunk;
    });

    request.on("end", () => {
      const parsed = new URLSearchParams(buffer);
      actions.login(request, response, parsed);
    });
  } else if (url.pathname === "/invalid-data") {
    actions.loadTemplate(request, response, "./");
  } else if (url.pathname === "/passed") {
    actions.loadTemplate(request, response, "./");
  }
};

const server = http.createServer(requestListener);
server.listen(8000);
console.log("The server was started on port 8000");
console.log('To stop the server, press "CTRL + C"');
