const LocalModel = require('../front/src/libs/localmodel');

let algomode = true;

let lm = new LocalModel(algomode);

if (algomode) {
	// 알고리즘 및 뷰 개발용
	lm.moveToSubject(null, null);

	const Traveler = require('../front/src/libs/traveler');
	const Quest = require('../front/src/libs/quest');

	console.log(Quest.generate_selection_quest(lm.wp.childs[0].childs[0], 4 , 1, false));
}
else {
	// axios 테스트 목적
	lm.getSubjectsList(list => {
		console.log(list);
	});

	lm.moveToSubject(1, wp => {
		lm.createInfo('선지국밥', wwp => {
			lm.createAttr('은', '소피를 굳힌 것을 넣은 국밥', '이다');
			console.log(wwp);
		});
	});
}