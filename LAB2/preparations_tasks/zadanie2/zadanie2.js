'use strict';
var expect = chai.expect;
function sum(x,y) {
    return x+y;
}

let input;
let actual_sum = 0;

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


describe('The sum() function', function() {
 it('Returns 4 for 2+2', function() {
   expect(sum(2,2)).to.equal(4);
 });
 it('Returns 0 for -2+2', function() {
   expect(sum(-2,2)).to.equal(0);
 });
});

describe('The cyfry(), litery(), suma() functions on digits only', function() {
  it('Cyfry("123") returns [4, 2].', function() {
    expect(cyfry("123")).deep.equal([4, 2]);
  })
  it('Litery("123") returns [0, 0].', function() {
    expect(litery("123")).deep.equal([0, 0]);
  })
  it('Suma("123") returns 123.', function() {
    expect(suma("123")).to.equal(123);
  })
})

describe('The cyfry(), litery(), suma() functions on characters only', function() {
  it('Cyfry("ABcde") returns [0, 0].', function() {
    expect(cyfry("ABcde")).deep.equal([0, 0]);
  })
  it('Litery("ABcde") returns [3, 2].', function() {
    expect(litery("ABcde")).deep.equal([3, 2]);
  })
  it('Suma("ABcde") returns 123.', function() {
    expect(suma("ABcde")).to.equal(123);
  })
})

describe('The cyfry(), litery(), suma() functions on characters first, digits second', function() {
  it('Cyfry("ABB21cde") returns [1, 2].', function() {
    expect(cyfry("AB21cde")).deep.equal([1, 2]);
  })
  it('Litery("ABB21cde") returns [3, 2].', function() {
    expect(litery("ABB21cde")).deep.equal([3, 3]);
  })
  it('Suma("ABB21cde") returns 123.', function() {
    expect(suma("ABB21cde")).to.equal(123);
  })
})

describe('The cyfry(), litery(), suma() functions on digits first, characters second', function() {
  it('Cyfry("27ABcde") returns [7, 2].', function() {
    expect(cyfry("27ABcde")).deep.equal([7, 2]);
  })
  it('Litery("27ABcde") returns [3, 2].', function() {
    expect(litery("27ABcde")).deep.equal([3, 2]);
  })
  it('Suma("27ABcde") returns 150.', function() {
    expect(suma("27ABcde")).to.equal(150);
  })
})

describe('The cyfry(), litery(), suma() functions on empty string', function() {
  it('Cyfry("") returns [0, 0].', function() {
    expect(cyfry("")).deep.equal([0, 0]);
  })
  it('Litery("") returns [3, 2].', function() {
    expect(litery("")).deep.equal([0, 0]);
  })
  it('Suma("") returns 150.', function() {
    expect(suma("")).to.equal(150);
  })
})
