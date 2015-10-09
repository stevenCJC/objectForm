define([], function () {



	function evalText(data) {

		var object = data.object;
		var group = data.group;
		var obj =data.obj;

		var text = '',
			item,
			var_,
			shim_text;
			text = '(function(object,src_obj){';
		
		for (var x in group) {

			item = group[x];
			var i=0;
			for (var h in item.header) {
				if (i == 0)
					text += 'object["' + x + '"]=(function(){var ' + item.header[h] + ';';
				else
					text += item.header[h] + ';';
				i++;
			}

			for (var k in item.keys)
				text += item.keys[k] + '=src_obj[' + k + '].value;';
			shim_text = '';
			for (var h in item.header)
				if (item.header[h].indexOf('=[]') > -1) {
					var_ = item.header[h].replace(/\=\[\]/, '');
					shim_text = var_ + '=shimArr(' + var_ + ')' + ';' + shim_text;
				}

			text += shim_text + 'return ' + x + ';})();';
		}

		text += 'function shimArr(arr){if(arr&&arr.constructor==Array){var a=[];for(var x in arr)a.push(arr[x]);return a;}else return arr;}';

		text += '})(object,obj)';
		try {
			eval(text);
		} catch (e) {
			console.error(text);
			throw 'Err: please check out the index or lack of define';
		}
		
	}
	
	return evalText;
});
