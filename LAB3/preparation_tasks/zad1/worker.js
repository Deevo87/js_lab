let iterations_worker;
let result_worker;

const main = () => {
    iterations_worker = document.querySelector('#iterations_worker');
    result_worker = document.querySelector('#result_worker');
}

function calculatePrimes() {
  console.log(iterations_worker);
    const iterations = document.forms[0].iterations_main.value || 50;
    // Source: https://udn.realityripple.com/docs/Tools/Performance/Scenarios/Intensive_JavaScript
    var primes = [];
    for (var i = 0; i < iterations; i++) {
      var candidate = i * (1000000000 * Math.random());
      var isPrime = true;
      for (var c = 2; c <= Math.sqrt(candidate); ++c) {
        if (candidate % c === 0) {
          // not prime
          isPrime = false;
          break;
        }
      }
      if (isPrime) {
        primes.push(candidate);
      }
    }
    result_worker.value = primes;
    return primes;
  }

document.addEventListener('DOMContentLoaded', main);
