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
		forEachPre(child, consummer);
	});
};

/*
	후위탐색으로 트리를 순회하며 consummer를 호출한다.

	Info root
		트리의 루트 주제

	function(info) consummer
		순회하면서 호출할 함수
*/
Traveler.forEachPre = function(root, consummer) {
	root.childs.forEach(child => {
		forEachPre(child, consummer);
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
	traverseUp(material, comm);
	return comm.out;
};

/*
	material과 관계있는 속성들을 Attr[]로 반환한다.
	n개를 찾지 못할 수도 있다.
*/
Traveler.selectPositiveAttrs = function(material, n) {
	if (n == 1)
		return Util.get_randomly(material.attrs);
	else
		return Util.get_randomly_multi(material.attrs, n);
};

/*
	material과 관계없는 속성들을 Attr[]로 반환한다.
	n개를 찾지 못할 수도 있따.
*/
Traveler.selectNegativeAttrs = function(material, n) {
};

module.exports = Traveler;