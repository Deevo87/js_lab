let actual_sum = 0;

const main = () => {
    console.log('essa')
    while (true) {
        load();
    }
}

const load = () => {
    input = window.prompt("Podaj ciąg znaków:");
    if (input !== '') {
        console.log(cyfry(input), litery(input), suma(input));
    } else {
        console.log("Empty string is not iterable");
        exit(1);
    }
}

const cyfry = (napis) => {
    let sum_even = 0;
    let sum_odd = 0;
    for (const value of napis) {
        if (Number(value)) {
            if (+value % 2 === 0) {
                sum_even += +value;
            } else {
                sum_odd += +value;
            }
        }
    }
    return [sum_odd, sum_even];
}

const litery = (napis) => {
    let sum_upper = 0;
    let sum_lower = 0;
    for (const value of napis) {
        if (!Number(value)) {
            if (value === value.toUpperCase()) {
                sum_upper += 1;
            } else {
                sum_lower += 1;
            }
        }
    }
    return [sum_lower, sum_upper];
}

const suma = (napis) => {
    let num = '';
    let i = 0;
    while (Number(napis[i])) {
        num += napis[i];
        i += 1;
    }
    actual_sum += +num; //'' daje 0 dlatego to działa
    return actual_sum
}
123
document.addEventListener('DOMContentLoaded', main);
