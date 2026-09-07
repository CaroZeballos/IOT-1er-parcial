function calcularSeno(x, n) {
  let suma = 0;

  for (let i = 0; i < n; i++) {
    const exponente = 2 * i + 1;
    const signo = i % 2 === 0 ? 1 : -1;

    let factorial = 1;

    for (let j = 1; j <= exponente; j++) {
      factorial *= j;
    }

    suma += signo * Math.pow(x, exponente) / factorial;
  }

  return suma;
}


function calcularCoseno(x, n) {
  let suma = 0;

  for (let i = 0; i < n; i++) {
    const exponente = 2 * i;
    const signo = i % 2 === 0 ? 1 : -1;

    let factorial = 1;

    for (let j = 1; j <= exponente; j++) {
      factorial *= j;
    }

    suma += signo * Math.pow(x, exponente) / factorial;
  }

  return suma;
}

function calcularExponencial(x, n) {
  let suma = 0;

  for (let i = 0; i < n; i++) {
    let factorial = 1;

    for (let j = 1; j <= i; j++) {
      factorial *= j;
    }

    suma += Math.pow(x, i) / factorial;
  }

  return suma;
}



module.exports = {
  calcularSeno,
  calcularCoseno,
  calcularExponencial
};