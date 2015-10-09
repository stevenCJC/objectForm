(function (object, src_obj) {
	object["aa"] = (function () {
		var aa = ;
		aa[2] = src_obj[5].value;
		return aa;
	})();
	object["wwww"] = (function () {
		var wwww = [];
		wwww[2] = {};
		wwww[2].aaa = [];
		wwww[2].aaa[4] = {};
		wwww[2].aaa[4].aa = {};
		wwww[2].aaa[4].aa.c1 = src_obj[11].value;
		wwww[2].aaa = shimArr(wwww[2].aaa);
		wwww = shimArr(wwww);
		return wwww;
	})();
	function shimArr(arr) {
		if (arr && arr.constructor == Array) {
			var a = [];
			for (var x in arr)
				a.push(arr[x]);
			return a;
		} else
			return arr;
	}
})(object, obj)
