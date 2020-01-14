const LocalModel = require('../front/src/libs/localmodel');

let lm = new LocalModel(true);
console.assert(lm.wp == null);

// loadModel TEST
//   should have wp as highest node
//   i.e. no parent exists
lm.moveToSubject('devmode');
console.assert(lm.wp.parent == null);

// getCurrentInfo TEST
//   In this hardcoded model, '국밥'
//   should be appeared
console.assert(lm.getCurrentInfo().names[0] == '국밥');

// moveToChild TEST
console.assert(lm.moveToChild(0).names[0] == '돼지국밥');

// getCurrentPath TEST
let p = lm.getCurrentPath();
let q = ['국밥', '돼지국밥'];
for (let i = 0; i < p.length; ++i) {
	console.assert(p[i] == q[i]);
}

// moveToParent TEST
console.assert(lm.moveToParent().names[0] == '국밥');
console.assert(lm.moveToParent() == null);

console.log(lm);

const Traveler = require('../front/src/libs/traveler');
const Quest = require('../front/src/libs/quest');

console.log(Quest.generate_binary_quest(lm.wp.childs[0].childs[0]));