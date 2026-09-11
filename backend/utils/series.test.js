const test = require("node:test");
const assert = require("node:assert/strict");
const {
  calcularSeno,
  calcularCoseno,
  calcularExponencial,
  calcularProgresion
} = require("./series");

test("la serie del seno aproxima Math.sin", () => {
  assert.ok(Math.abs(calcularSeno(0.5, 8) - Math.sin(0.5)) < 1e-12);
});

test("la serie del coseno aproxima Math.cos", () => {
  assert.ok(Math.abs(calcularCoseno(0.5, 8) - Math.cos(0.5)) < 1e-12);
});

test("la serie exponencial aproxima Math.exp", () => {
  assert.ok(Math.abs(calcularExponencial(0.5, 12) - Math.exp(0.5)) < 1e-12);
});

test("la progresión devuelve exactamente n aproximaciones", () => {
  const progresion = calcularProgresion("SER001", 0.5, 6);
  assert.equal(progresion.length, 6);
  assert.equal(progresion.at(-1).termino, 6);
  assert.equal(progresion.at(-1).valor, calcularSeno(0.5, 6));
});
