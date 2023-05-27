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
    actions.loadTemplate(
      request,
      response,
      "C:/Users/rafal/OneDrive/Pulpit/4_semestr/js/LAB4/homework/src"
    );
  } else if (
    (url.pathname.endsWith(".jpg") || url.pathname.endsWith(".jpeg")) &&
    request.method === "GET"
  ) {
    actions.loadImg(
      request,
      response,
      "C:/Users/rafal/OneDrive/Pulpit/4_semestr/js/LAB4/homework/src"
    );
  } else if (url.pathname === "/" && request.method === "POST") {
    let buffer = "";

    request.on("data", (chunk) => {
      buffer += chunk;
    });

    request.on("end", () => {
      const parsed = new URLSearchParams(buffer);
      actions.performTransfer(request, response, parsed);
    });
  }
};

const server = http.createServer(requestListener);
server.listen(8000);
console.log("The server was started on port 8000");
console.log('To stop the server, press "CTRL + C"');
