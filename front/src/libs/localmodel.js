const Info = require('./info');
const Attr = require('./attr');
const Mocktest = require('./mocktest');
const axios = require('axios').default;

/*
	LocalModel은 클라이언트에서 다루는 주제 트리와
	현재 위치 등을 다루는 상태 관리 클래스다.
	외부에서 트리 탐색을 좀 더 쉽게 할 수 있다.

	LocalModel의 내부에는 wp(working page)라는
	레퍼런스가 존재하며, 이것으로 현재 페이지를
	구분할 수 있다.
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

		// 서버 주소
		this.url = 'https://my-json-server.typicode.com/Phryxia/demo';
	}

	/*
		서버에 존재하는 모든 주제의 리스트를 불러와
		callback으로 전달한다. 실패하면 []를 전달한다.

		devmode에서는 하드코딩된 [{name: '국밥', id: 1}]을 전달한다.

		전달 형식:
			[{name: '주제명', id: '주제id'}]
	*/
	getSubjectsList(callback) {
		if (this.devmode)
		{
			if (callback)
				window.setTimeout(() => { callback([{'name': '국밥', id: 1}]); }, 0);
		}
		else
		{
			// 요청 !
			axios({
				'method': 'get',
				'url': this.url + '/getInfosList',
				'params': {}
			})
			.then(response => {
				// response에 대한 자세한 전달 데이터는
				// https://git.alien.moe/ynifamily3/software-competition/wiki/%ED%86%B5%EC%8B%A0%EA%B7%9C%EA%B2%A9
				// 참고
				// 에러 체크
				if (!response.data.state) {
					console.log('[LocalModel::getSubjectsList] Fail to fetch data.');
					console.log(response.data.msg);
					if (callback)
						callback([]);
					return ;
				}

				console.log(response.data);
				let myJson = response.data;

				if (!callback)
					return;

				let out = [];
				for (let i = 0; i < myJson.names.length; ++i) {
					out.push({
						'name': myJson.names[i],
						'id': myJson.ids[i]
					});
				}
				callback(out);
			})
			.catch(err => {
				console.log('[LocalModel::getSubjectsList] Fail to fetch data.');
				console.log(err);
			});
		}
	}

	/*
		서버에서 id를 ID로 갖는 주제를 불러온 뒤
		그 주제의 최상단 지식으로 이동한다.

		불러오는데 성공하면 callback으로 최상단 Info를
		전달하며 실패하면 callback으로 null을 전달한다.

		devmode에서는 하드코딩된 국밥 주제를 로드하며
		항상 성공한다.
	*/
	moveToSubject(id, callback) {
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
				window.setTimeout(() => { callback(this.wp); }, 0);
			return;
		}

		axios({
			'method': 'get',
			'url': this.url + '/readInfo',
			'params': {
				'id': id
			}
		})
		.then(response => {
			// 에러 체크
			if (!response.data.state) {
				console.log('[LocalModel::moveToSubject] Fail to fetch data.');
				console.log(response.data.msg);
				if (callback)
					callback(null);
				return ;
			}

			// 토폴로지를 다시 재조립해준다.
			// 원리는 다음과 같다.
			// 1. 모든 Info를 일단 등록한다.
			// 2. edges를 순회하며 연결해준다.
			// 3. root를 this.wp에 등록한다.
			let myJson = response.data;

			// phase 1)
			let nodes = myJson.nodes.map(pInfo => {
				// 새 Info 할당
				let newNode = this.__allocateInfo(pInfo.name, []);
				newNode.id = pInfo.id;

				// 속성 등록
				pInfo.attrs.forEach(pAttr => {
					this.__appendAttr(newNode, pAttr.prefix, 
						pAttr.content, pAttr.postfix, pAttr.id);
				});

				return newNode;
			});

			// phase 2)
			myJson.edges.forEach(pair => {
				this.__appendInfo(nodes[pair[0]], nodes[pair[1]]);
			});

			// phase 3)
			this.wp = nodes[0];

			if (callback)
				callback(this.wp);
		})
		.catch(err => {
			console.log('[LocalModel::moveToSubject] Fail to fetch data.');
			console.log(err);
			if (callback)
				callback(null);
		});
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

		devmode에서는 아무렇게나 ID를 부여한다.

		String   name
			새 과목의 이름

		function(wp) callback
			통신이 종료된 뒤 처리해야하는 로직
			인자로 wp Info를 준다.
	*/
	createSubject(name, callback) {
		if (this.devmode) {
			let newInfo = this.__allocateInfo(name);
			newInfo.id = `${(new Date()).getTime()}`;
			this.wp = newInfo;

			if (callback)
				window.setTimeout(() => { callback(this.wp); }, 0);
			return ;
		}

		// 서버에 주제를 추가하고 id값을 받아온다.
		// Fake Server인 경우 get으로 바꿔줘야 동작한다.
		axios({
			'method': 'post',
			'url': this.url + '/createInfo',
			'data': {
				'name': name,
				'parentId': null
			}
		})
		.then(response => {
			// 에러 체크
			if (!response.data.state) {
				console.log('[LocalModel::createSubject] Fail to update data.');
				console.log(response.data.msg);
				if (callback)
					callback(null);
				return ;
			}

			// 새 주제를 추가한다.
			let newInfo = this.__allocateInfo(name);
			newInfo.id = response.data.id;
			this.wp = newInfo;

			if (callback)
				callback(this.wp);
		})
		.catch(err => {
			console.log('[LocalModel::createSubject] Fail to fetch data.');
			console.log(err);
			if (callback)
				callback(null);
		});
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
		if (this.wp == null)
			return;

		// 개발모드에서는 아무렇게나 id를 부여한다.
		if (this.devmode) {
			let newInfo = this.__allocateInfo(name);
			this.__appendInfo(this.wp, newInfo)
			this.wp = newInfo;
			this.wp.id = `${(new Date()).getTime()}`;

			if (callback)
				window.setTimeout(() => { callback(this.wp); }, 0);
			return ;
		}
		
		// 서버에 주제를 추가하고 id값을 받아온다.
		// Fake Server인 경우 get으로 바꿔줘야 동작한다.
		axios({
			'method': 'post',
			'url': this.url + '/createInfo',
			'data': {
				'name': name,
				'parentId': this.wp.id
			}
		})
		.then(response => {
			// 에러 체크
			if (!response.data.state) {
				console.log('[LocalModel::createInfo] Fail to update data.');
				console.log(response.data.msg);
				if (callback)
					callback(null);
				return ;
			}

			// 새 주제를 추가하고 부모와 연결한다.
			let newInfo = this.__allocateInfo(name);
			this.__appendInfo(this.wp, newInfo)
			this.wp = newInfo;
			this.wp.id = response.data.id;

			if (callback)
				callback(this.wp);
		})
		.catch(err => {
			console.log('[LocalModel::createInfo] Fail to fetch data.');
			console.log(err);
			if (callback)
				callback(null);
		});
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

		function(attr) callback
			통신이 종료된 뒤 처리해야하는 로직
			인자로 생성한 attr을 준다.
	*/
	createAttr(prefix, content, postfix, callback) {
		if (this.wp == null)
			return;

		// 개발모드에서는 아무렇게나 ID를 부여한다.
		if (this.devmode) {
			let aid = `${(new Date()).getTime()}`;
			let attr = this.__appendAttr(this.wp, prefix, content, postfix, aid);

			if (callback)
				window.setTimeout(() => { callback(attr); }, 0);
			return;
		}

		// 서버에 속성을 추가하고 id값을 받아온다.
		// Fake Server인 경우 get으로 바꿔줘야 동작한다.
		axios({
			'method': 'post',
			'url': this.url + '/createAttr',
			'data': {
				'prefix': prefix,
				'content': content,
				'postfix': postfix,
				'parentId': this.wp.id
			}
		})
		.then(response => {
			// 에러 체크
			if (!response.data.state) {
				console.log('[LocalModel::createAttr] Fail to update data.');
				console.log(response.data.msg);
				if (callback)
					callback(null);
				return ;
			}

			// 새 주제를 추가하고 부모와 연결한다.
			let attr = this.__appendAttr(this.wp, prefix, content, postfix, response.data.aid);

			if (callback)
				callback(attr);
		})
		.catch(err => {
			console.log('[LocalModel::createAttr] Fail to fetch data.');
			console.log(err);
			if (callback)
				callback(null);
		});
	}

	/*
		현재 위치를 소재로 n개의 문제를 가진 모의고사를 만들어
		반환한다.

		어지간하면 안터지는데, 특이케이스(모든 지식의 속성이 0개인 경우)
		에는 터질 수도 있어서 try catch문 사용 요망...
	*/
	createMocktest(n) {
		return Mocktest.create_mocktest(this.wp, n);
	}

	/*
		DANGER ZONE
	*/
	__allocateInfo(name) {
		let newInfo = new Info([name], []);
		this.infos[newInfo.jsid] = newInfo;
		return newInfo;
	}

	__appendInfo(parent, child) {
		parent.childs.push(child);
		child.parent = parent;
	}

	__appendAttr(info, prefix, content, postfix, aid) {
		let newAttr = new Attr(info, prefix, content, postfix);
		newAttr.id = aid;
		info.attrs.push(newAttr);
		return newAttr;
	}
};

module.exports = LocalModel;