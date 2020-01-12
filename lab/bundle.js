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
		return this.content + this.postfix + '.';
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
			this.moveToParent();
			this.createInfo('소고기국밥', null);
			this.createAttr('은', '대전이 맛있', '다', null);
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
},{"../front/src/libs/localmodel":3}]},{},[4]);
