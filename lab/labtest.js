const LocalModel = require('../front/src/libs/localmodel');
const Mocktest = require('../front/src/libs/mocktest');

let algomode = true;

let lm = new LocalModel(algomode);

if (algomode) {
	// 알고리즘 및 뷰 개발용
	lm.moveToSubject('국밥', (wp => {
		let mocktest = Mocktest.create_mocktest(wp, 4);
		console.log(mocktest);
	}));
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