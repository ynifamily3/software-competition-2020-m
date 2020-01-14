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
		ex) "는 바보다."
	*/
	getHintSentence(josa) {
		return (josa ? this.prefix + ' ' : '') + this.content + this.postfix + '.';
	}
};

module.exports = Attr;