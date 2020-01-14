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
			this.createAttr('은', '경남의 체인점', '이다.', null);
			this.createAttr('에는', '20년째 운영하는 집도', '있다.', null);

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