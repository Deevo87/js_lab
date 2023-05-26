import http from "node:http";
import { URL } from "node:url";
import { exec } from "node:child_process";
// import fs from "node:fs/promises";
import fs from 'fs-extra';

const requestListener = (request, response) => {
    console.log('--------------------------------------');
    console.log(`The relative URL of the current request: ${request.url}`);
    console.log(`Access method: ${request.method}`);
    console.log('--------------------------------------');
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (url.pathname === '/' && request.method === 'GET') {
        response.write(`
<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your first page</title>
    </head>
    <body>
    <main>
        <form method="GET" action="/submit">
            <label for="options">Wybierz flagi programu:</label>
            <select name="options" id="options">
              <option value="async">--async</option>
              <option value="sync">--sync</option>
              <option value="none">--</option>
            </select>
            <br>
            <label for="command">Podaj komendę systemową:</label>
            <textarea name="command" id="command" rows="4" cols="30"></textarea>
            <br>
            <input type="submit">
        </form>
    </main>
    </body>
</html>
        `);

        response.end();
    } else if (url.pathname === '/submit' && request.method === 'GET') {
        let option = url.searchParams.get('options');
        let commands = url.searchParams.get('command');
        console.log(`Options: ${url.searchParams.get('options')}`);
        if (option === 'async') {
            let cntFile = "cnt.txt";
            const updateCounterAndFile = async () => {
                try {
                    let count;
                    try {
                         fs.access(cntFile)
                    } catch(err) {
                        await fs.writeFile(cntFile, "0", "utf-8");
                    }

                    count = await fs.readFile(cntFile, "utf-8");

                    count = parseInt(count);
                    count += 1;
                    console.log(`Liczba wywołań: ${count}`);

                    await fs.writeFile(cntFile, count.toString(), "utf-8");
                    return count;
                } catch (err) {
                    console.error(`Error: ${err}`);
                    return -1;
                }
            }
            const writeHTML = async () => {
                const cnt = await updateCounterAndFile();
                await response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                response.write(
                  `<html>
                    <body>
                        <p>Liczba uruchomień: ${cnt}</p>
                    </body>
                   </html>`
                );
                response.end();
            }
            writeHTML();
            response.end();
        } else if(option === 'sync') {
            let cntFile = "cnt.txt";
            const updateCounterAndFile = () => {
                try {
                    let count;
                    try {
                        fs.access(cntFile)
                    } catch(err) {
                        fs.writeFileSync(cntFile, "0", "utf-8");
                    }

                    count = fs.readFileSync(cntFile, "utf-8");
                    count = parseInt(count);
                    count += 1;

                     fs.writeFileSync(cntFile, count.toString(), "utf-8");
                    return count;
                } catch (err) {
                    console.error(`Error: ${err}`);
                    return -1;
                }
            }
            const writeHTML = () => {
                const cnt = updateCounterAndFile();
                response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                response.write(
                  `<html>
                    <body>
                        <p>Liczba uruchomień: ${cnt}</p>
                    </body>
                   </html>
                   `);
                response.end();
            }
            writeHTML();
            response.end();
        } else if (option === 'none'){
            console.log(`${commands}`);
            exec(commands, (error, stdout, stderr) => {
                if (error) {
                    console.log(`Wystąpił błąd: ${error}`);
                } else {
                    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                    console.log(`${stdout}`);
                    response.write(`
                    <html>
                    <body>
                        <p>Liczba uruchomień: ${stdout}</p>
                    </body>
                   </html>
                    `)
                }
            })
            response.end();
        } else {
            response.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
            response.write(
                `<html>
                    <body>
                        <p>Error 400: Bad Request - Ewidentnie coś źle zrobiłeś ;/.</p>
                    </body>
                </html>`
            );
            response.end();
        }
    }
}

const server = http.createServer(requestListener);
server.listen(8000);
console.log('The server was started on port 8000');
console.log('To stop the server, press "CTRL + C"');
