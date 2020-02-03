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
    if (!Array.isArray(answers)) {
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
  let ans = null;
  let fact = null;

  // 부모가 없음, 즉 루트인 경우 부정명제를 가져올 수 없다.
  // 따라서 이 경우 항상 참인 명제만 선택하게 한다.
  if (material.parent != null && Math.random() > 0.5) {
    ans = 'F';
    //if(Math.random() > 0.5)
    // 	fact = Soup.select_negative_attrs(material, 1);
    // else
    // 	fact = Soup.mutate_attr(Soup.select_positive_attr(material));
    fact =
      material.names[0] +
      Traveler.selectNegativeAttrs(material, 1)[0].getHintSentence(true);
  } else {
    ans = 'T';
    fact = Traveler.selectPositiveAttrs(material, 1)[0].getFullSentence();
  }

  let name = Util.get_randomly(material.names);
  return new Quest(
    'binary',
    '다음 문장의 참/거짓을 판별하시오.',
    fact,
    ['T', 'F'],
    [ans],
    material,
  );
};

// 참거짓 채점기
// 답을 맞춰야 함
// Info g
Quest.evaluator['binary'] = function(quest, response) {
  if (response.length != 1) return false;
  else return quest.answers[0] == response[0];
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

  // 정답 선택지 만들기
  let pos = Traveler.selectPositiveAttrs(material, p);

  // 오답 선택지 만들기
  let neg = Traveler.selectNegativeAttrs(material, n - p);

  // 선택지 만들기
  // 일단 정답부터 만들고, attr 개체를 string으로 변환한다.
  // 섞고, pos가 있는 위치들을 찾고, pos와 neg를 문장으로 변환.
  let choices = Util.shuffle(pos.concat(neg), false);
  let answers = null;
  if (inv)
    answers = neg.map((attr) => {
      return `${choices.indexOf(attr)}`;
    });
  else
    answers = pos.map((attr) => {
      return `${choices.indexOf(attr)}`;
    });
  let name = Util.get_randomly(material.names);
  choices = choices.map((attr) => {
    return attr.getHintSentence(false);
  });

  // 표현
  let logic_label = inv ? '옳지 않은 것' : '옳은 것';
  return new Quest(
    'selection',
    `다음 중 ${name}에 대한 설명으로 ${logic_label}을 고르시오.`,
    null,
    choices,
    answers,
    material,
  );
};

// n지선다 채점기
// 답을 모두 맞춰야 함
Quest.evaluator['selection'] = function(quest, response) {
  if (quest.answers.length != response.length) return false;
  quest.answers.sort();
  response.sort();
  for (let i = 0; i < response.length; ++i)
    if (quest.answers[i] != response[i]) return false;
  return true;
};

// 단답식 유형 문제 생성
Quest.generate_short_quest = function(material, n) {
  // 속성이 n개보다 적을 경우, n을 조절해줘서 util.js가
  // 뻑나지 않도록 한다.
  if (material.attrs.length < n) n = material.attrs.length;
  let attrs = Traveler.selectPositiveAttrs(material, n);
  let title = '다음이 설명하는 것을 적으시오.';
  let stmt = '';
  attrs.forEach((attr) => {
    stmt += '\n * ' + attr.getHintSentence(false);
  });
  return new Quest('short', title, stmt, [], material.names, material);
};

// 단답식 채점기
// 답 중 하나만 맞추면 됨
Quest.evaluator['short'] = function(quest, response) {
  if (response.length != 1) return false;
  for (let i = 0; i < quest.answers.length; ++i)
    if (quest.answers[i] == response[i]) return true;
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
  pos.attrs.forEach((attr) => {
    stmt += '\n * ' + attr.getHintSentence(false);
  });

  // 오답 선택지 찾기
  let neg_infos = Traveler.selectNegativeInfos(material);

  // 선택지 합치기
  neg_infos.push(pos);
  neg_infos = neg_infos.slice(0, n);
  Util.shuffle(neg_infos, false);
  let choices = neg_infos.map((info) => {
    return Util.get_randomly(info.names);
  });
  let answers = [`${neg_infos.indexOf(material)}`];

  // 표현
  return new Quest('selection', title, stmt, choices, answers, material);
};

module.exports = Quest;
