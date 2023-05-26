let azure;
let aside;
let footer;
let main_el;
let h1;
let delete_styles;
let set;
let add;
let navigation;
let list;
let buttons;

const main = () => {
    prepareDOMElements();
    prepareDOMEvents();
}

const prepareDOMElements = () => {
    azure = document.querySelectorAll(".azure");
    aside = document.querySelector("aside");
    footer = document.querySelector("footer");
    main_el = document.querySelector("main");
    h1 = document.querySelector("h1");
    delete_styles = document.querySelector(".delete");
    set = document.querySelector(".set");
    add = document.querySelector(".add");
    navigation = document.querySelector(".navigation");
    list = document.querySelector("nav ul");
    buttons = document.querySelector(".buttons");
}

const prepareDOMEvents = () => {
    set.addEventListener('click', setAllStyles);
    delete_styles.addEventListener('click', turnOffStyles);
}

const setAllStyles = () => {
    azureStyle();
    navigationStyle();
    listStyle();
    asideStyle();
    mainStyle();
    footerStyle();
    styleButtons();
}

const turnOffStyles = () => {
    for (let i = 0; i < azure.length; i += 1) {
        azure[i].style = "";
    }
    navigation.style = "";
    h1.style = "";
    footer.style = "";
    aside.style = "";
    buttons.style = "";
    main_el.style = "";
    list.style = "";
}

const azureStyle = () => {
    for (let i = 0; i < azure.length; i += 1) {
        azure[i].style.backgroundColor = '#EFF';
        azure[i].style.border = '2px solid black';
        azure[i].style.padding = '0.75rem';
    }
}

const navigationStyle = () => {
    navigation.style.width = '5rem';
    navigation.style.paddingLeft = '3rem';
}

const h1Style = () => {
    h1.style.margin = '0';
}

const listStyle = () => {
    list.style.paddingLeft = '3rem';
    list.style.width = 'fit-content';
}

const mainStyle = () => {
    main_el.style.width = '40%';
}

const footerStyle = () => {
    footer.style.marginTop = '1rem';
}

const asideStyle = () => {
    aside.style.width = '46%';
    aside.style.position = 'relative';
    aside.style.top = '-5rem';
    aside.style.float = 'right';
}

const styleButtons = () => {
    buttons.style.margin = '2rem';
}

const displayParagraphs = () => {

    for (let line = start; line < wojskiConcert.length; line += 1) {
        if (line === last_line) {
            bre
        }
    }
}

document.addEventListener('DOMContentLoaded', main);

let start = 0;
let end = 0;
const wojskiConcert = [
    'Natenczas Wojski chwycił na taśmie przypięty',
    'Swój róg bawoli, długi, cętkowany, kręty',
    'Jak wąż boa, oburącz do ust go przycisnął,',
    'Wzdął policzki jak banię, w oczach krwią zabłysnął,',
    'Zasunął wpół powieki, wciągnął w głąb pół brzucha',   
    'I do płuc wysłał z niego cały zapas ducha,',
    'I zagrał: róg jak wicher, wirowatym dechem',
    'Niesie w puszczę muzykę i podwaja echem.',
    '',
    'Umilkli strzelcy, stali szczwacze zadziwieni',
    'Mocą, czystością, dziwną harmoniją pieni.',
    'Starzec cały kunszt, którym niegdyś w lasach słynął,',
    'Jeszcze raz przed uszami myśliwców rozwinął;',
    'Napełnił wnet, ożywił knieje i dąbrowy,',
    'Jakby psiarnię w nie wpuścił i rozpoczął łowy.',
    '',
    'Bo w graniu była łowów historyja krótka:',
    'Zrazu odzew dźwięczący, rześki: to pobudka;',
    'Potem jęki po jękach skomlą: to psów granie;',
    'A gdzieniegdzie ton twardszy jak grzmot: to strzelanie.'
  ];