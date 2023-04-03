let button;
let add1;
let add2;

const main = () => {
    console_log_prompt();
}


const saveInputs = () => {
    add1 = document.forms[0].elements[0];
    add2 = document.forms[0].elements[1];
    console.log("wczytanaWartośćZPolaTekstowego: %s, typWczytanejWartości: %s", add1.value, typeof(add1.value))
    console.log("wczytanaWartośćZPolaTekstowego: %s, typWczytanejWartości: %s", add2.value, typeof(add2.value))
}

const console_log_prompt = () => {
    let input;
    for (let i = 0; i < 4; i += 1) {
        input = window.prompt("Podaj coś do wyświetlenia:");
        console.log("To co wpisałem: %s, typ tego co wpisałem: %s", input, typeof(input));
    }
}

document.addEventListener('DOMContentLoaded', main);