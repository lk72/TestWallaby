'use strict'
var mcl = require("mcl-wasm")
const assert = require('assert')
const { performance } = require('perf_hooks')

//await curveTest(mcl.BLS12_381, 'BLS12_381')
//await stdCurveTest(mcl.SECP256K1, 'secp256k1')

//mcl.init(mcl.BLS12_381)
mcl.init(mcl.SECP256K1)
  .then(() => {
    try {
      console.log("mcl.SECP256K1")
      benchAll()
      //bAll()
    } catch (e) {
      console.log(`FAIL ${e}`)
      assert(false)
    }
  })
// var   a = null
// var   b = null 



function bench(label, count, func) {
  const start = performance.now()
  for (let i = 0; i < count; i++) {
    func()
  }
  const end = performance.now()
  const t = (end - start) / count
  const roundTime = (Math.round(t * 1000)) / 1000
  console.log(label + ' ' + roundTime)
}


function testMyTime() {

  const a = new mcl.Fr()
  var inv_a = new mcl.Fr()
  const b = new mcl.Fr()
  const r = new mcl.Fr()
  const h = new mcl.Fr()
  const n_h = new mcl.Fr()
  const resp_h = new mcl.Fr()
  const ver_h = new mcl.Fr()

  //const Q = new mcl.G2()

  var A = new mcl.G1()

  var B = new mcl.G1()
  var aP = new mcl.G1()
  var bP = new mcl.G1()

  var R = new mcl.G1()
  var n_R = new mcl.G1()
  var hP = new mcl.G1()
  var hPR = new mcl.G1()
  var n_hP = new mcl.G1()
  var nbP = new mcl.G1()
  var hB = new mcl.G1()
  var haP = new mcl.G1()
  var hA = new mcl.G1()
  var n_hB = new mcl.G1()
  var hBR = new mcl.G1()
  var hAR = new mcl.G1()


  a.setByCSPRNG()
  b.setByCSPRNG()

  let P = mcl.hashAndMapToG1('abc')


  A = mcl.mul(P, a)
  B = mcl.mul(P, b);


  r.setByCSPRNG();

  R = mcl.mul(P, r);
  h.setHashOf(R.getStr());
  hP = mcl.mul(P, h);
  hPR = mcl.add(hP, R);

  hA = mcl.mul(A, h);
  hB = mcl.mul(B, h);


  inv_a = mcl.inv(a)
  n_hP = mcl.mul(hA, inv_a);

  n_R = mcl.sub(hPR, n_hP);
  n_h.setHashOf(n_R.getStr());

  n_hB = mcl.mul(B, n_h);

  if (n_hB.getStr() == hB.getStr()) {
    resp_h.setHashOf(n_R.getStr() + "resp");
  } else {
    console.log("Bad challange");
  }

  ver_h.setHashOf(R.getStr() + "resp");
  if (resp_h.getStr() == ver_h.getStr()) {
    //console.log("Accept");
  } else {
    console.log("Reject");
  }
  //mcl.pairing(P, Q)

}


function benchAll() {
  bench('testing:', 10, testMyTime)
}






