const a = 2 * Math.PI / 6;
const r = 10;
const b = 2 * Math.PI;
let ctx;
let chart;
var canvas;
let cmd_input;
let submit_btn;
let ifChart;
let allElements;
let interavlID = -1;
let cnt = 0;
let changing = 0;
let timeoutID = -1;
let last = -1;

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
    // addingCustomers(customer1);
    // removingCustomer(6);
}

request.onerror = (event) => {
    console.log('Error IndexedDb', event);
}

const createRequest = () => {
    const objectStore = db.transaction(["customers"], "readwrite").objectStore("customers");
}

const main = () => {
    prepareDOMElements();
    prepareDOMEvents();
    creatingCanvas();
    // makeDatabase();
}


const prepareDOMElements = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    cmd_input = document.querySelector('#cmd_input');
    submit_btn = document.querySelector('.submit-btn');
    chart = document.querySelector('.bank-balance');
    allElements = document.querySelectorAll('.card');
    console.log(allElements);
}

const prepareDOMEvents = () => {
    submit_btn.addEventListener('click', parser);
}

//creating/opening database

const makeDatabase = () => {

    
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const bankObject = db.createObjectStore("customers", { keyPath: "id", autoIncrement: true });
        bankObject.createIndex("firstname", "firstname", { unique: false });
        bankObject.createIndex("lastname", "lastname", { unique: false });
        bankObject.createIndex("email", "email", { unique: true });
        bankObject.createIndex("customer_img", "customer_img", { unique: false });
        bankObject.createIndex("subaccounts", ["subaccountID", "type", "balance"]);
        bankObject.createIndex("main_account_balance", "main_account_balance", { unique: false });
        bankObject.createIndex("main_account_type", "main_account_type", { unique: false });
        
        const versions = db.createObjectStore("versions", { keyPath: "dataBaseId", autoIncrement: true });
        versions.createIndex("currentVersion", "currentVersion", { unique: true });
        versions.createIndex("oldVersion", "oldVersion", { unique: true });
    }
}

const addingCustomers = (customer) => {
    
    const transaction = db.transaction(["customers"], "readwrite");

    transaction.onerror = (event) => {
        console.log("no ewidentnie nie działa ", event);
    }

    const addingToBank = transaction.objectStore("customers");
    const addRequest = addingToBank.add(customer);
    addRequest.onsuccess = (event) => {
        let curr_id = event.target.result;
        console.log("Gratulacje! Udało ci się założyć konto. Twój numer ID to: ", curr_id);
    }
}

const removingCustomer = (clientID) => {
    const removeRequest = db.transaction(["customers"], "readwrite").objectStore("customers").delete(clientID);

    removeRequest.onsuccess = (event) => {
        console.log("deleted customer ", db);
    }

    removeRequest.onerror = (event) => {
        console.log("no ewidentnie nie usnąłem nic ", event);
    }
}

const parser = () => {
    if (ifChart) {
        destroyChart();
    }
    const input = cmd_input.value;
    const lines = input.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
        lines[i] = lines[i].split(' ');
    }
    let clientID;

    for (let line of lines) {
        if (line.length < 3) {
            break;
        }
        let str = line[1].toLowerCase();
        if (str === 'account') {
            let new_fname = line[2];
            let new_lname = line[3];
            let new_email = line[4];
            let new_customer_img = line[5];
            let new_type = line[6];
            let new_balance = line[7];
            makeAccount(new_fname, new_lname, new_email, new_customer_img, new_type, new_balance);
        } else if (str === 'open') {
            clientID = line[0];
            let subaccount_type = line[3];
            openSubaccount(clientID, subaccount_type);
        } else if (str === 'transfer') {
            clientID = line[0];
            let transfer_to = line[3];
            let amount = +line[4];
            transfer(clientID, transfer_to, amount);
        } else if (str === 'withdrawal') {
            clientID = line[0];
            let amount = +line[2];
            let withdrawal_from = line[4];
            withdrawal(clientID, withdrawal_from, amount);
        } else if (str === 'bank') {
            clientID = line[0];
            creatingCharts(clientID);
        } else {
            console.log('Incorrect input');
        }
    }
}

//obsługa komend
const makeAccount = (fname, lname, email, img, type, balance) => {
    
    const customer = {
        firstname: fname,
        lastname: lname,
        email: email,
        customer_img: img,
        main_account_type: type,
        subaccounts: [],
        main_account_balance: +balance
    }

    addingCustomers(customer);
}

const openSubaccount = (clientID, type) => {
    // createRequest();
    let objectStore = db.transaction(["customers"], "readwrite").objectStore("customers");

    let request = objectStore.get(Number(clientID));
    request.onerror = (event) => {
        console.log("nie pobrał elementu: ", event);
    }

    request.onsuccess = (event) => {
        let data = event.target.result;
        let allSubaccounts = data.subaccounts;

        let new_subaccount = subaccountTemplate(data.subaccounts.length + 1, type, 0);
        allSubaccounts.push(new_subaccount)

        data.subaccounts = allSubaccounts;
        let requestUpdate = objectStore.put(data);

        requestUpdate.onsuccess = (event) => {
            console.log("Nowo utworzone subkonto: ", new_subaccount);
        }

        requestUpdate.onerror = (event) => {
            console.log("Niestety nie udało się dodać nowego subkonta, sprawdź poprawność danych: ", event);
        }
    }
}

const subaccountTemplate = (subaccountID, type, balance) => {
    let new_subaccount = {
        subaccountID: subaccountID,
        type: type,
        balance: balance
    };
    return new_subaccount;
}

const transfer = (clientID, tranfer_to, amount) => {
    let objectStore = db.transaction(["customers"], "readwrite").objectStore("customers");

    let request = objectStore.get(Number(clientID));
    request.onerror = (event) => {
        console.log("Nie udało pobrać się elementu z bazy: ", event);
    }

    request.onsuccess = (event) => {
        let data = event.target.result;
        if (amount > data.main_account_balance) {
            console.log("Brak środków na koncie!");
            return;
        }

        if (tranfer_to > data.subaccounts.length) {
            console.log("Nie ma subkonta o podanym ID!");
            return;
        }

        data.main_account_balance = data.main_account_balance - amount;
        data.subaccounts[tranfer_to - 1].balance = data.subaccounts[tranfer_to - 1].balance + amount;

        let requestUpdate = objectStore.put(data);
        requestUpdate.onerror = (event) => {
            console.log("Nie można dokonać przelewu: ", event);
        }

        requestUpdate.onsuccess = (event) => {
            console.log("Przelew został zaksięgowany, akutalny stan głównego konta: %i, aktulany stan subkonta: %i", data.main_account_balance, data.subaccounts[tranfer_to - 1].balance);
        }
    }
}

const withdrawal = (clientID, withdrawl_from, amount) => {
    let objectStore = db.transaction(["customers"], "readwrite").objectStore("customers");

    let request = objectStore.get(Number(clientID));
    request.onerror = (event) => {
        console.log("Nie udało pobrać się elementu z bazy: ", event);
        return;
    }

    request.onsuccess = (event) => {
        let data = event.target.result;
        let acc_balance = data.subaccounts[withdrawl_from - 1].balance
        if (amount > acc_balance) {
            console.log("Brak środków na koncie!");
            return;
        }

        if (withdrawl_from > data.subaccounts.length) {
            console.log("Nie ma subkonta o podanym ID!");
            return;
        }

        data.subaccounts[withdrawl_from - 1].balance = acc_balance - amount;
        let new_balance = data.subaccounts[withdrawl_from - 1].balance;

        console.log("Bilans po wypłacie z subkonta o nr ID %i wynosi %i", withdrawl_from, new_balance);
    }
}

const destroyChart = () => {
    balance_chart.destroy();
}

const creatingCharts = (clientID) => {
    let objectStore = db.transaction(["customers"], "readwrite").objectStore("customers");

    let request = objectStore.get(Number(clientID));
    request.onerror = (event) => {
        console.log("Nie udało pobrać się elementu z bazy: ", event);
        return;
    }

    request.onsuccess = (event) => {
        ifChart = true;
        let data = event.target.result;
        let chart_label = data.firstname + ' ' + data.lastname + "'s";
        let main_acc = data.main_account_balance;
        let allSubaccounts = data.subaccounts;
        let labels = ['main account'];
        let acc_balances = [main_acc]
        for (let i = 0; i < allSubaccounts.length; i += 1) {
            labels.push('subaccount' + allSubaccounts[i].subaccountID);
            acc_balances.push(allSubaccounts[i].balance);
        }

        window.balance_chart = new Chart(chart, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: chart_label,
                    data: acc_balances,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    }
}

//switching colors
let flag = 1;
const switchColor = () => {

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

const changeState = (flag) => {
    console.log("flag: %i", flag);
    if (flag === 0 ) {
        console.log("intervalID: %i", interavlID);
        if (interavlID < 0) {
            return;
        }
        cnt += 1;
        console.log("Zatrzymałem interwal i tyle razy to zrobiłem: %i: ", cnt);
        clearInterval(interavlID);
    }
    interavlID = setInterval(changeRandomCard, 2000);
}

const changeRandomCard = () => {
    let max = allElements.length - 1;
    console.log("maxxx: %i", max);
    let random = Math.floor(Math.random() * max);
    console.log("start\nwylosowany numer: %i", random);
    console.log("halo kurwa: %i", last);
    if (last >= 0) {
        allElements[last].style.backgroundColor = '#ffffff';
    }
    allElements[random].style.backgroundColor = '#000000';
    last = random;
}

const stopChanging = () => {
    cnt += 1;
    changing = 0;
    console.log("stop: ", cnt);
    if (interavlID > 0){
        clearInterval(interavlID);
    }
}

document.addEventListener('DOMContentLoaded', main);

// document.addEventListener("mouseout", (event) => {
//     cnt += 1;
//     console.log("Stop: ", cnt);
//     clearInterval(interavlID);
//     changing = 0;
// })

document.addEventListener("mousemove", (event) => {
    if (changing === 0) {
        cnt = 0;
        changing = 1;
        interavlID = setInterval(changeRandomCard, 500);
    }
    if (timeoutID > 0) {
        clearTimeout(timeoutID)
    }
    timeoutID = setTimeout(stopChanging, 1000);
})
