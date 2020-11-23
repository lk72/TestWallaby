'use strict'
var mcl = require("mcl-wasm")
const assert = require('assert')
const { performance } = require('perf_hooks')

const curveTest = (curveType, name) => {
  mcl.init(curveType)
    .then(() => {
      try {
        console.log(`name=${name}`)
        benchAll()
        bAll()
      } catch (e) {
        console.log(`TEST FAIL ${e}`)
        assert(false)
      }
    })
}


async function curveTestAll () {
//   can't parallel
//   await curveTest(mcl.BN254, 'BN254')
//   await curveTest(mcl.BN381_1, 'BN381_1')

     await curveTest(mcl.BLS12_381, 'BLS12_381')

//   await curveTest(mcl.BN462, 'BN462')
//   await stdCurveTest(mcl.SECP224K1, 'secp224k1')
//   await stdCurveTest(mcl.SECP256K1, 'secp256k1')
//   await stdCurveTest(mcl.SECP384R1, 'secp384r1')
//   await stdCurveTest(mcl.NIST_P192, 'NIST_P192')
//   await stdCurveTest(mcl.NIST_P256, 'NIST_P256')
}

curveTestAll()

  /*
    hashAndMapToG2(msg) = [setHashOf(msg), 0].mapToG2()
  */
 



function bench (label, count, func) {
  const start = performance.now()
  for (let i = 0; i < count; i++) {
    func()
  }
  const end = performance.now()
  const t = (end - start) / count
  const roundTime = (Math.round(t * 1000)) / 1000
  console.log(label + ' ' + roundTime)
}


function testMyTime () {
    const a = new mcl.Fr()
    const b = new mcl.Fr()
    
    a.setByCSPRNG()
    b.setByCSPRNG()
  
    let P = mcl.hashAndMapToG1('abc')
    let Q = mcl.hashAndMapToG2('abc')
  
    const aP = mcl.mul(P,a)
    const bQ = mcl.mul(Q, b)
    const bP = mcl.mul(P,b)
    const aQ = mcl.mul(Q, a)
    
    
    
    const e1 = mcl.pairing(aP, bQ)
    const e2 = mcl.pairing(bP, aQ)
  
    // console.log(e2.getStr())
    // console.log(e2.getStr() == e1.getStr()); 
    // console.log(e1.isEqual(e2));
  
  }
  

  function bAll () {
    const a = new mcl.Fr()
  
    const msg = 'hello wasm'
  
    a.setByCSPRNG()
    let P = mcl.hashAndMapToG1('abc')
    let Q = mcl.hashAndMapToG2('abc')
    const P2 = mcl.hashAndMapToG1('abce')
    const Q2 = mcl.hashAndMapToG2('abce')
    const Qcoeff = new mcl.PrecomputedG2(Q)
    const e = mcl.pairing(P, Q)
  
    console.log('benchmark')
    const C = 1
    const C2 = 1
    bench('T_Fr::setByCSPRNG', C, () => a.setByCSPRNG())
    bench('T_pairing', C, () => mcl.pairing(P, Q))
    bench('T_G1::add', C2, () => { P = mcl.add(P, P2) })
    bench('T_G1::mul', C, () => { P = mcl.mul(P, a) })
    bench('T_G2::add', C2, () => { Q = mcl.add(Q, Q2) })
    bench('T_G2::mul', C, () => { Q = mcl.mul(Q, a) })
    bench('T_hashAndMapToG1', C, () => mcl.hashAndMapToG1(msg))
    bench('T_hashAndMapToG2', C, () => mcl.hashAndMapToG2(msg))
  
    let b = new mcl.Fr()
    b.setByCSPRNG()
    bench('T_Fr::add', C2, () => { b = mcl.add(b, a) })
    bench('T_Fr::mul', C2, () => { b = mcl.mul(b, a) })
    bench('T_Fr::sqr', C2, () => { b = mcl.sqr(b) })
    bench('T_Fr::inv', C2, () => { b = mcl.inv(b) })
  
    let e2 = mcl.pairing(P, Q)
    bench('T_GT::add', C2, () => { e2 = mcl.add(e2, e) })
    bench('T_GT::mul', C2, () => { e2 = mcl.mul(e2, e) })
    bench('T_GT::sqr', C2, () => { e2 = mcl.sqr(e2) })
    bench('T_GT::inv', C, () => { e2 = mcl.inv(e2) })
  
    Qcoeff.destroy()
  }
  

function benchAll () {
    bench('testing:', 1, testMyTime)
}




