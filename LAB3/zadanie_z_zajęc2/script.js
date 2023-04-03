const a = 2 * Math.PI / 6;
const r = 10;
const b = 2 * Math.PI;
var canvas;
let cmd_input;
let submit_btn;

const customer1 = {
    firstname: "Robert",
    lastname: "Lewandowski",
    email: "robert.lewandowski@gmail.com",
    customer_img: "ładne zdjęcie roberta",
    subaccounts: [
        {subaccountID: 1, type: "PLN", balance: 1000},
        {subaccountID: 2, type: "USD", balance: 2000},
        {subaccountID: 3, type: "EUR", balance: 3000},
    ],
    main_account_type: "EUR",
    main_account_balance: 20000
}


const request = window.indexedDB.open("BankStorage", 1);
let db;

request.onsuccess = (event) => {
    db = event.target.result;
    console.log("Otwarto");
    // addingCustomers();
}

request.onerror = (event) => {
    console.log('Error IndexedDb', event);
}


const main = () => {

    prepareDOMElements();
    prepareDOMEvents();
    creatingCanvas();
    makeDatabase();
}


const prepareDOMElements = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    cmd_input = document.querySelector('#cmd_input');
    submit_btn = document.querySelector('.submit-btn');
}

const prepareDOMEvents = () => {
    submit_btn.addEventListener('click', parser);
}

//creating/opening database


//upgradowanie bazy jak user ma starą TODO
// request.onupgradeneeded = () => {
//     let db = request.result;
//     switch (event.oldVersion) {
//         case 0:
//             makeDatabase();
//         case 1:

//     }
// }

const makeDatabase = () => {

    
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const bankObject = db.createObjectStore("customers", { keyPath: "id", autoIncrement: true });
        bankObject.createIndex("firstname", "firstname", { unique: false });
        bankObject.createIndex("lastname", "lastname", { unique: false });
        bankObject.createIndex("email", "email", { unique: true });
        bankObject.createIndex("customer_img", "customer_img", { unique: false });
        bankObject.createIndex("subaccounts", ["subaccountID", "type", "balance"], { unique: false });
        bankObject.createIndex("main_account_balance", "main_account_balance", { unique: false });
        bankObject.createIndex("main_account_type", "main_account_type", { unique: false });
        
        const versions = db.createObjectStore("versions", { keyPath: "dataBaseId", autoIncrement: true });
        versions.createIndex("currentVersion", "currentVersion", { unique: true });
        versions.createIndex("oldVersion", "oldVersion", { unique: true });
    }
}

const addingCustomers = () => {

    const transaction = db.transaction(["customers"], "readwrite");

    transaction.oncomplete = (event) => {
        console.log("DZIAŁA");
    }

    transaction.onerror = (event) => {
        console.log("no ewidentnie nie działa ", event);
    }

    const addingToBank = transaction.objectStore("customers");
    const addRequest = addingToBank.add(customer1);
    addRequest.onsuccess = (event) => {
        console.log("Dodałem customera");
    }
    
}


const parser = () => {
    const input = cmd_input.value;
    const lines = input.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
        lines[i] = lines[i].split(' ');
    }

    for (let line of lines) {
        let str = line[0].toLowerCase();
        if (str === 'new') {
            console.log(str);
            let new_account_type = line[2];
        } else if (str === 'open') {
            console.log(str);
            let subaccount_type = line[2];
        } else if (str === 'transfer') {
            console.log(str);
            let transfer_to = line[2];
            let amount = +line[3];
        } else if (str === 'withdrawal') {
            console.log(str);
            let amount = +line[1];
            let withdrawal_from = line[3];
        } else if (str === 'bank') {
            console.log(str);
        } else {
            console.log(str)
            console.log('Incorrect input');
        }
        
    }
}


//drawing_canvas

const creatingCanvas = () => {
    drawHexagon(r, r);
    drawCircle(b);
    drawTriangle();
}

function drawHexagon(x, y) {
    ctx.beginPath();
    ctx.strokeStyle='#ff7400';
    ctx.fillStyle='#e76f51';
    for (var i = 0; i < 6; i++) {
        ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
    }
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}


function drawCircle(R) {
    ctx.beginPath();
    ctx.strokeStyle='#ffc100';
    ctx.fillStyle='#ffc100';
    ctx.arc(10, 12, 5, 0, R);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

function drawTriangle() {
    ctx.moveTo(2, 6);
    ctx.lineTo(10, 2);
    ctx.lineTo(20, 6);

    ctx.fill();
}

document.addEventListener('DOMContentLoaded', main);
