function generarProgresion(tipo, x, n) {
  const cantidad = Math.max(0, Number(n) || 0);
  const puntos = [];
  let termino;
  let suma = 0;

  if (tipo === "SER001") {
    termino = x;
  } else if (tipo === "SER002" || tipo === "SER003") {
    termino = 1;
  } else {
    return puntos;
  }

  for (let i = 0; i < cantidad; i++) {
    if (i > 0) {
      if (tipo === "SER001") {
        termino *= (-x * x) / ((2 * i) * (2 * i + 1));
      } else if (tipo === "SER002") {
        termino *= (-x * x) / ((2 * i - 1) * (2 * i));
      } else {
        termino *= x / i;
      }
    }

    suma += termino;
    puntos.push({ termino: i + 1, valor: suma });
  }

  return puntos;
}

function valorFinal(tipo, x, n) {
  return generarProgresion(tipo, x, n).at(-1)?.valor ?? 0;
}

function calcularSeno(x, n) {
  return valorFinal("SER001", x, n);
}

function calcularCoseno(x, n) {
  return valorFinal("SER002", x, n);
}

function calcularExponencial(x, n) {
  return valorFinal("SER003", x, n);
}

function calcularProgresion(serieId, x, n) {
  return generarProgresion(serieId, x, n);
}

module.exports = {
  calcularSeno,
  calcularCoseno,
  calcularExponencial,
  calcularProgresion
};
