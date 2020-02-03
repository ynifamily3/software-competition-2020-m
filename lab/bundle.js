(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
	Attr 클래스는 Info의 속성, 문장을 매끄럽게
	나타낼 수 있는 조사 및 어미를 저장다.
*/
class Attr {
	/*
		LocalModel에서 새로운 주제/속성 생성
		인터페이스를 제공하므로, 외부 사용자는
		이 생성자를 사용하지 말 것

		Info pinfo
			이 Attr을 소유하는 Info
			
		String prefix
			pinfo의 이름에 대응되는 조사
			ex) 사과"는" 바보다

		String content
			이 Attr의 내용을 서술하는 구
			ex) 사과는 "바보"다

		String postfix
			content에 대응되는 접미사
			문장부호는 붙이지 않는다.
			ex) 사과는 바보"다"
	*/
	constructor(pinfo, prefix, content, postfix) {
		console.assert(pinfo != null);
		console.assert(typeof(prefix) == 'string');
		console.assert(typeof(content) == 'string');
		console.assert(typeof(postfix) == 'string');

		this.pinfo = pinfo;
		this.prefix = prefix;
		this.content = content;
		this.postfix = postfix;
		this.id = null;
	}

	/*
		이 속성을 완전히 설명하는 문장을 반환한다.
		이때 문장의 마지막에 부호를 붙인다.
		ex) "사과는 바보다."

		Integer nidx (Optional)
			부모의 이름 중 몇 번째를 가져올지 결정한다.
			생략되면 0으로 간주한다.
	*/
	getFullSentence(nidx) {
		nidx = nidx ? nidx : 0;
		return this.pinfo.names[nidx]
			+ this.prefix + ' '
			+ this.content + this.postfix + '.';
	}

	/*
		주어를 제외한 문장을 반환한다.
		ex) "바보다."
	*/
	getHintSentence() {
		return this.prefix + ' ' + this.content + this.postfix + '.';
	}
};

module.exports = Attr;
},{}],2:[function(require,module,exports){
class Info {
	/*
		String[] names: 지식의 이름들, 반드시 1개 이상
		Attr  [] attrs: 지식의 속성들
	*/
	constructor(names, attrs) {
		console.assert(names instanceof Array && names.length > 0);
		console.assert(attrs instanceof Array);

		this.names = names;
		this.attrs = attrs;
		this.comment = '';

		// parent는 이 Info를 소유한 지식을 레퍼런스로 저장한다.
		// childs는 이 Info가 가진 하위 지식(들)을 레퍼런스로 저장한다.
		this.parent = null;
		this.childs = [];

		// id는 DB에 지식이 처음으로 저장될 때 할당받는다.
		// 클라이언트에서 생성된 지식은 id를 갖지 않는다.
		this.id = null;

		// jsid는 클라이언트에서 임의의 두 지식을 식별하기 위한 값이다.
		// 이 값은 클라이언트가 실행된 이후로 Info가 생성된 순서와 같다.
		// 본래 id가 그 역할을 했으나, 몽고 DB에서의 고유키를 저장하는 것으로 바뀌면서
		// jsid가 탄생하였다. jsid의 유일성은 한 세션 내에서만 보장된다.
		this.jsid = Info.jsidcnt++;
		
		//this.ext = [];
	}

	toJSON() {
		return {
			names: this.names,
			attrs: this.attrs,
			comment: this.comment,
			id: this.id
		};
	}
}

Info.jsidcnt = 0;

module.exports = Info;
},{}],3:[function(require,module,exports){
const Info = require('./info');
const Attr = require('./attr');

/*
	LocalModel은 클라이언트에서 다루는 주제 트리와
	현재 위치 등을 다루는 상태 관리 클래스다.
	외부에서 트리 탐색을 좀 더 쉽게 할 수 있다.

	LocalModel의 내부에는 wp(working page)라는
	레퍼런스가 존재하며, 이것으로 현재 페이지를
	구분할 수 있다.

	한 번 subject로 
*/
class LocalModel {
	/*
		네트워크 통신 없이 내장된 모델로 수행하려면
		devmode를 켜주세요.
	*/
	constructor(devmode) {
		// WorkingPointer(이하 wp)는 파일 시스템의
		// Working Directory와 비슷한 개념으로,
		// 현재 맥락(Context)에서 보여줄 지식을 가리킨다.
		// 만약 주제에 진입하지 않은 경우 null을 가리킨다.
		this.wp = null;

		// 
		// jsid -> Info로 매핑해주는 변수
		this.infos = {};

		// 프론트 개발을 쉽게 할 목적으로 만든 모드
		// 네트워크 통신을 수행하지 않고 미리 하드코딩한
		// 모델을 사용한다.
		this.devmode = devmode;
	}

	/*
		서버에 존재하는 모든 주제의 리스트를 불러와
		callback으로 전달한다. 실패하면 []를 전달한다.

		devmode에서는 하드코딩된 ['국밥']을 전달한다.
	*/
	getSubjectsList(callback) {
		console.warn('함수가 미구현 상태입니다');

		if (this.devmode && callback)
			callback(['국밥']);

		callback([]);
	}

	/*
		서버에서 name을 이름으로 갖는 주제를 불러온 뒤
		그 주제의 최상단 지식으로 이동한다.

		불러오는데 성공하면 callback으로 최상단 노드를
		전달하며 실패하면 callback으로 null을 전달한다.

		devmode에서는 하드코딩된 국밥 주제를 로드하며
		항상 성공한다.
	*/
	moveToSubject(name, callback) {
		console.warn('함수가 미구현 상태입니다');

		if(this.devmode) {
			this.createSubject('국밥', null);
			this.createAttr('은', '든든', '하다', null);
			this.createAttr('은', '뜨뜻', '하다', null);
			
			this.createInfo('돼지국밥', null);
			this.createAttr('에는', '순대가 들어', '있다', null);
			this.createAttr('은', '경남에서 유명', '하다', null);

			this.createInfo('무봉리순대국밥', null);
			this.createAttr('은', '경남의 체인점', '이다', null);
			this.createAttr('에는', '20년째 운영하는 집도', '있다', null);

			this.moveToParent();

			this.createInfo('할매순대국밥', null);
			this.createAttr('은', '실제로는 없는 브랜드', '이다', null);
			this.createAttr('은', '어쩌면 하나쯤은 있을수도', '있다', null);

			this.moveToParent();
			this.moveToParent();
			
			this.createInfo('소고기국밥', null);
			this.createAttr('은', '대전이 맛있', '다', null);
			this.createAttr('은', '얼큰한 국물이 인상적', '이다', null);
			this.moveToParent();

			// Comment
			// 이거 나중에 Promise로 안바꾸면 재앙이
			// 벌어질 것 같은 구조인데\
			if (callback)
				callback(this.wp);
			return;
		}

		if (callback)
			callback(null);
	}

	/*
		현재 wp가 가리키는 Info를 반환한다.
		만약 메인 페이지인 경우 null을 반환한다.
	*/
	getCurrentInfo() {
		return this.wp;
	}

	/*
		루트에서 현재 WorkingPointer까지의 경로를
		String[]으로 반환한다.

		ex) ["컴파일러", "LLParser", "복잡도"]
	*/
	getCurrentPath() {
		if (this.wp == null) {
			return [];
		}
		else {
			let out = [];
			let curnode = this.wp;
			while (curnode != null) {
				out.push(curnode.names[0]);
				curnode = curnode.parent;
			}
			// reverse 함수는 in-place이다.
			return out.reverse();
		}
	}

	/*
		현재 부모 Info를 반환한다.
		만약 부모가 메인 페이지인 경우 null을 반환한다.
	*/
	getParentInfo() {
		if (this.wp == null) {
			return null;
		}
		else {
			return this.wp.parent;
		}
	}

	/*
		현재 자식 Info들을 배열로 반환한다.
		만약 wp가 메인 페이지인 경우 []를 반환한다.
	*/
	getChildInfos() {
		if (this.wp == null) {
			return [];
		}
		else {
			return this.wp.childs;
		}
	}

	/*
		현재 wp의 부모로 이동하고
		그 부모의 Info를 반환한다.

		만약 wp 또는 부모가 메인 페이지인 경우 
		아무것도 하지 않고 null을 반환한다.
	*/
	moveToParent() {
		if (this.wp == null || this.wp.parent == null) {
			return null;
		}
		else {
			return this.wp = this.wp.parent;
		}
	}


	/*
		현재 wp의 idx번째 자식으로 이동하고
		그 자식의 Info를 반환한다.

		만약 그런 자식이 없으면
		아무것도 안하고 null을 반환한다.
		
		만약 현재 페이지가 메인 페이지인 경우 
		아무것도 안하고 null을 반환한다.
	*/
	moveToChild(idx) {
		console.assert(idx !== undefined);
		if (this.wp == null) {
			return null;
		}
		else if (this.wp.childs.length <= idx || idx < 0) {
			return null;
		}
		else {
			return this.wp = this.wp.childs[idx];
		}
	}

	/*
		종료하고 메인페이지로 돌아간다.
	*/
	exitToMainPage() {
		this.wp = null;
		this.infos = {};
	}

	/*
		새 과목을 추가하고 wp를 그 과목으로 이동시킨다.
		그 과정에서 AJAX 통신이 발생한다.

		String   name
			새 과목의 이름

		function(wp) callback
			통신이 종료된 뒤 처리해야하는 로직
			인자로 wp Info를 준다.
	*/
	createSubject(name, callback) {
		console.warn('함수가 미구현 상태입니다');

		// 새 주제를 추가한다.
		let newInfo = new Info([name], []);
		this.infos[newInfo.jsid] = newInfo;
		
		// 서버에 주제를 추가하고 id값을 받아온다.
		// newInfo.id = server.createSubject(newInfo);

		this.wp = newInfo;
		if (callback)
			callback(this.wp);
	}

	/*
		새 하위 주제를 wp에 추가하고 wp를 그 주제로
		이동시킨다.
		그 과정에서 AJAX 통신이 발생한다.
		만약 wp가 null이면 아무것도 하지 않는다.

		String   name
			새 주제의 이름

		function(wp) callback
			통신이 종료된 뒤 처리해야하는 로직
			인자로 wp Info를 준다.
	*/
	createInfo(name, callback) {
		console.warn('함수가 미구현 상태입니다');
		if (this.wp == null)
			return;

		// 새 주제를 추가하고 부모와 연결한다.
		let newInfo = new Info([name], []);
		this.infos[newInfo.jsid] = newInfo;
		this.wp.childs.push(newInfo);
		newInfo.parent = this.wp;
		
		// 서버에 주제를 추가하고 id값을 받아온다.
		// newInfo.id = server.createSubject(this.wp, newInfo);

		this.wp = newInfo;
		if (callback)
			callback(this.wp);
	}

	/*
		새 속성을 wp에 추가한다.
		그 과정에서 AJAX 통신이 발생한다.
		만약 wp가 null이면 아무것도 하지않는다.

		String prefix
			pinfo의 이름에 대응되는 조사
			ex) 사과"는" 바보다

		String content
			이 Attr의 내용을 서술하는 구
			ex) 사과는 "바보"다

		String postfix
			content에 대응되는 접미사
			문장부호는 붙이지 않는다.
			ex) 사과는 바보"다"

		function(wp) callback
			통신이 종료된 뒤 처리해야하는 로직
			인자로 wp Info를 준다.
	*/
	createAttr(prefix, content, postfix, callback) {
		console.warn('함수가 미구현 상태입니다');
		if (this.wp == null)
			return;

		let newAttr = new Attr(this.wp, prefix, content, postfix);
		this.wp.attrs.push(newAttr);

		// 서버에 속성을 추가한다.
		// server.createAttr(this.wp, newAttr);

		if (callback)
			callback(this.wp);
	}
};

module.exports = LocalModel;
},{"./attr":1,"./info":2}],4:[function(require,module,exports){
const Info = require('./info');
const Traveler = require('./traveler');
const Util = require('./util');
const Queue = require('./queue');

/*
	Quest 쓰는 방법

	1. 문제 만들기
	let quest = Quest.{만들고 싶은 문제에 해당하는 생성 함수}([인자])
	quest.statement	// 지문
	quest.choices	// 선택지로 보여줄 문자열 집합
	quest.answers	// 정답

	2. 문제 매기기
	boolean Quest.evaluate(quest, response)

	3. 참/거짓 문제
	Quest Quest.generate_binary_quest(Info g);

	참/거짓 문제의 response는 ['T'] 또는 ['F'] 여야 한다.
	
	4. n지선다 문제
	Quest Quest.generate_selection_quest(Info g, int n, int a, boolean inv)
		n: 선택지 수
		a: 골라야 하는 답의 수
		inv: 참이면 '옳지 않은 것', 거짓이면 '옳은 것'

	n지선다 문제의 response는 ['0', '3', ...], 즉 음이 아닌 정수를 나타낸
	문자열의 집합이어야 한다.

	5. 단답형 문제
	Quest Quest.generate_short_quest(Info g, int n);
		n: 주어지는 정보 수

	6. n지선다 문제 Attr to Name형
	Quest Quest.generate_selection2_quest(Info g, int n, int a)
		n: 선택지 수
		a: 골라야 하는 답의 수

	이 이외의 함수는 건드렸을 때 책임 안짐
*/

class Quest {
	/*
		type은 {'binary', 'selection', 'short'} 중 하나일 것
	*/
	constructor(type, title, statement, choices, answers, materials) {
		console.assert(type);
		console.assert(title);
		console.assert(Array.isArray(choices));
		console.assert(Array.isArray(answers));
		if(!Array.isArray(answers)) {
			console.log('babo');
			console.log(answers);
		}
		this.type = type;
		this.title = title;
		this.statement = statement;
		this.choices = choices;
		this.answers = answers;
		this.materials = materials;
	}
}

Quest.evaluate = function(quest, response) {
	return Quest.evaluator[quest.type](quest, response);
};

Quest.evaluator = {};

// 참/거짓 유형 문제 생성
Quest.generate_binary_quest = function(material) {
	// let subinfos = Soup.fetch_subinfos([g]).filter(info => {
	// 	return info.attrs.length > 0;
	// });
	// let material = Util.get_randomly(subinfos);
	let ans = null;
	let fact = null;
	if(Math.random() > 0.5) {
		ans = 'T';
		fact = Traveler.selectPositiveAttrs(material, 1)[0].getFullSentence();
	}
	else {
		ans = 'F';
		//if(Math.random() > 0.5)
		// 	fact = Soup.select_negative_attrs(material, 1);
		// else
		// 	fact = Soup.mutate_attr(Soup.select_positive_attr(material));
		fact = material.names[0] + Traveler.selectNegativeAttrs(material, 1)[0].getHintSentence();
	}
	let name = Util.get_randomly(material.names);
	return new Quest('binary', '다음 문장의 참/거짓을 판별하시오.',
		fact, ['T', 'F'], [ans], material);
};

// 참거짓 채점기
// 답을 맞춰야 함
// Info g
Quest.evaluator['binary'] = function(quest, response) {
	if(response.length != 1)
		return false;
	else
		return quest.answers[0] == response[0];
};

// n지선다 유형 문제 생성
// material은 반드시 root가 아니어야 한다. root면 무조건 에러난다.
// 문제 생성에 실패할 경우 에러가 발생한다.
//
// material의 속성의 수는 a (inv가 true이면 n - a)개 이상이어야 한다.
// material: 문제를 출제할 지식
// n: 선택지의 수
// a: 정답의 수
// inv: 옳은/옳지 않은
Quest.generate_selection_quest = function(material, n, a, inv) {
	let p = inv ? n - a : a;
	let g = material;

	// 정답 선택지 만들기
	let pos = Traveler.selectPositiveAttrs(material, p);

	// 오답 선택지 만들기
	//let neg = Soup.select_negative_attrs(g, material, n - p);
	let neg = Traveler.selectNegativeAttrs(material, n - p);

	// 선택지 합치기
	let choices = Util.shuffle(pos.concat(neg), false);
	let answers = null;
	if(inv)
		answers = neg.map(attr => {
			return `${choices.indexOf(attr)}`;
		});
	else
		answers = pos.map(attr => {
			return `${choices.indexOf(attr)}`;
		});
	let name = Util.get_randomly(material.names);

	// 표현
	let logic_label = inv ? '옳지 않은 것' : '옳은 것';
	return new Quest('selection', 
		`다음 중 ${name}에 대한 설명으로 ${logic_label}을 고르시오.`,
		null, choices, answers, material);
};

// n지선다 채점기
// 답을 모두 맞춰야 함
Quest.evaluator['selection'] = function(quest, response) {
	if(quest.answers.length != reponse.length)
		return false;
	quest.answers.sort();
	response.sort();
	for(let i = 0; i < response.length(); ++i)
		if(quest.answers[i] != response[i])
			return false;
	return true;
};

// 단답식 유형 문제 생성
Quest.generate_short_quest = function(material, n) {
	// 속성이 n개보다 적을 경우, n을 조절해줘서 util.js가
	// 뻑나지 않도록 한다.
	if(material.attrs.length < n)
		n = material.attrs.length;
	let attrs = Soup.select_positive_attrs(material, n);
	let title = '다음이 설명하는 것을 적으시오.';
	let stmt = '';
	attrs.forEach(attr => {
		stmt += '\n * ' + attr;
	});
	return new Quest('short', title, stmt, [], material.names, material);
};

// 단답식 채점기
// 답 중 하나만 맞추면 됨
Quest.evaluator['short'] = function(quest, response) {
	if(response.length != 1)
		return false;
	for(let i = 0; i < quest.answers.length; ++i)
		if(quest.answers[i] == response[i])
			return true;
	return false;
};

// n지선다 유형 II 문제 생성
// 속성을 주고 이름을 고르는 것
// material은 반드시 root가 아니어야 한다. root면 무조건 에러난다.
// 문제 생성에 실패할 경우 에러가 발생한다.
//
// 그래프에 n개 이상의 지식이 존재해야 한다.
// material: 문제를 출제할 지식
// n: 선택지의 수
Quest.generate_selection2_quest = function(material, n) {
	// 다른 지식의 이름을 가져올 범위를 찾는다.
	let g = material;
	let q = new Queue();

	// 정답 선택지 만들기
	let pos = material;

	let title = '다음이 설명하는 것으로 알맞은 것을 고르시오.';
	let stmt = '';
	pos.attrs.forEach(attr => {
		stmt += '\n * ' + attr;
	});

	// 오답 선택지 찾기
	// 자기 자식을 전부 discard 시키기
	let history = {};
	let neg_infos = [];
	Soup.for_each_childs_pre([material], root => {
		history[root.jsid] = 1;
	});
	material.parents.forEach(parent => {
		q.push(parent);
	});
	while(!q.empty() && neg_infos.length < n - 1) {
		// 부모를 뽑아서 그 자식들을 neg_infos에 집어넣는다.
		let current = q.pop();
		if(history[current.jsid])
			continue;
		history[current.jsid] = 1;

		// for every child except history[id] > 0
		current.childs.forEach(child => {
			if(history[child.jsid])
				return;
			if(neg_infos.length >= n - 1)
				return;
			neg_infos.push(child);
			q.push(child);
		})
		if(neg_infos.length >= n - 1)
			break;
		current.parents.forEach(parent => {
			if(history[parent.jsid])
				return;
			q.push(parent);
		});
	}
	if(neg_infos.length < n - 1)
		throw new Error('[Quest::generate_selection2_quest] Fail to make quest as there are not enough infos');

	// 선택지 합치기
	neg_infos.push(pos)
	Util.shuffle(neg_infos, false);
	let choices = neg_infos.map(info => {
		return Util.get_randomly(info.names);
	});
	let answers = [`${neg_infos.indexOf(material)}`];

	// 표현
	return new Quest('selection2', title, stmt, choices, answers, material);
};

module.exports = Quest;
},{"./info":2,"./queue":5,"./traveler":6,"./util":7}],5:[function(require,module,exports){
class Queue {
	constructor() {
		this.first = null;
		this.last = null;
		this.size = 0;
	}

	push(value) {
		if(this.first == null) {
			this.first = this.last = {
				value,
				next: null
			};
		}
		else {
			this.last = this.last.next = {
				value,
				next: null
			};
		}
		++this.size;
		return value;
	}

	pop() {
		if(!this.first)
			return null;
		let out = this.first.value;
		this.first = this.first.next;
		if(this.first == null)
			this.last = null;
		--this.size;
		return out;
	}

	front() {
		if(this.empty())
			return null;
		return this.first.value;
	}

	back() {
		if(this.empty())
			return null;
		return this.last.value;
	}

	empty() {
		return this.first == null;
	}
};

module.exports = Queue;
},{}],6:[function(require,module,exports){
const Util = require('./util');

/*
	Traveler 클래스는 알고리즘이 트리를 쉽게
	탐색 할 수 있도록 도와주는 유틸리티 클래스다.
*/
class Traveler {
};

/*
	전위탐색으로 트리를 순회하며 consummer를 호출한다.

	Info root
		트리의 루트 주제

	function(info) consummer
		순회하면서 호출할 함수
*/
Traveler.forEachPre = function(root, consummer) {
	consummer(root);
	root.childs.forEach(child => {
		Traveler.forEachPre(child, consummer);
	});
};

/*
	후위탐색으로 트리를 순회하며 consummer를 호출한다.

	Info root
		트리의 루트 주제

	function(info) consummer
		순회하면서 호출할 함수
*/
Traveler.forEachPost = function(root, consummer) {
	root.childs.forEach(child => {
		Traveler.forEachPost(child, consummer);
	});
	consummer(root);
};

/*
	material과 관계없는 지식들을 Info[]로 반환한다.
	정점 수 V에 대해 O(lg V)의 시간복잡도로 동작한다.
	반환된 배열의 앞쪽에 있는 지식일수록 그래프 상에서
	거리가 가깝다.
*/
Traveler.selectNegativeInfos = function(material) {
	console.assert(material != null);

	function traverseUp(root, comm) {
		// collect except visited node
		root.childs.forEach(child => {
			if (!comm.visited[child.jsid])
				comm.out.push(child);
		});

		// going up
		comm.visited[root.jsid] = true;
		if (root.parent)
			traverseUp(root.parent, comm);
	}

	let comm = { visited: {}, out: [] };
	Traveler.forEachPre(material, info => {
		comm.visited[info.jsid] = true;
	});
	traverseUp(material, comm);
	return comm.out;
};

/*
	material과 관계있는 속성들을 Attr[]로 반환한다.
	n개를 찾지 못할 수도 있다.
*/
Traveler.selectPositiveAttrs = function(material, n) {
	console.assert(material != null);
	if (n <= 1)
		return [Util.get_randomly(material.attrs)];
	else
		return Util.get_randomly_multi(material.attrs, Math.min(n, material.attrs.length));
};

/*
	material과 관계없는 속성들을 Attr[]로 반환한다.
	n개를 찾지 못할 수도 있따.
*/
Traveler.selectNegativeAttrs = function(material, n) {
	console.assert(material != null);

	// 속성을 전부 불러온다
	let infos = Traveler.selectNegativeInfos(material);
	let attrs = [];
	infos.forEach(info => {
		attrs = attrs.concat(info.attrs);
	});
	console.log(attrs);

	if (n <= 1)
		return [Util.get_randomly(attrs)];
	else
		return Util.get_randomly_multi(attrs, Math.min(n, attrs.length));
};

module.exports = Traveler;
},{"./util":7}],7:[function(require,module,exports){
const Util = {};

/*
	min ≤ x ≤ max, x ∈ Z를 만족하는 임의의 정수를 반환한다.
*/
Util.random_int = function(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min + 0.5);
};

/*
	min ≤ x ≤ max, x ∈ Z를 만족하는 중복되지 않는
	n개의 서로 다른 x를 만들어서 반환한다.
	O(max - min)의 공간복잡도와 시간복잡도가 발생한다.
*/
Util.random_choices = function(min, max, n) {
	min = Math.ceil(min);
	max = Math.floor(max);
	let N = max - min + 1;
	if(N < n) {
		throw new Error(`[random_choice] Cannot choose ${n} different numbers between ${min} ~ ${max}`);
	}

	// min ~ max까지의 숫자를 만든다
	let out = [];
	for(let i = 0; i < N; ++i)
		out[i] = min + i;

	// 적당히 섞는다.
	Util.shuffle(out);

	// n개만 반환한다.
	if(n == N)
		return out;
	else
		return out.slice(0, n);
};

/*
	arr를 무작위로 섞는다.
	outplace가 true이면 새 배열을 반환한다.
*/
Util.shuffle = function(arr, outplace) {
	if(outplace)
		arr = arr.slice();
	let temp, idx1, idx2;
	for(let i = 0; i < 4 * arr.length; ++i) {
		idx1 = Util.random_int(0, arr.length - 1);
		idx2 = Util.random_int(0, arr.length - 1);
		temp = arr[idx1];
		arr[idx1] = arr[idx2];
		arr[idx2] = temp;
	}
	return arr;
};

/*
	배열 arr에서 아무 원소나 반환한다.
	시간 복잡도가 O(1)이다
*/
Util.get_randomly = function(arr) {
	return arr[Util.random_int(0, arr.length - 1)];
};

/*
	배열 arr에서 아무 원소를 n개 찍어서 반환한다.
	시간 복잡도가 O(n)이다
*/
Util.get_randomly_multi = function(arr, n) {
	return Util.random_choices(0, arr.length - 1, n).map(idx => {
		return arr[idx];
	});
};

/*
	배열 arr에서 아무 원소를 n개 찍어서 반환한다.
	중복이 허용된다.
*/
Util.get_randomly_multi_dup = function(arr, n) {
	let out = [];
	for(let i = 0; i < n; ++i)
		out[i] = Util.get_randomly(arr);
	return out;
};

module.exports = Util;
},{}],8:[function(require,module,exports){
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
},{"../front/src/libs/localmodel":3,"../front/src/libs/quest":4,"../front/src/libs/traveler":6}]},{},[8]);
