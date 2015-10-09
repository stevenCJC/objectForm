define([], function () {



	function filterDefine(obj) {

		var object = {};
		var group = {};

		var index,
		f2o_index,
		tmp_obj,
		name,
		name_splited;
		
		
		for (var x = 0; x < obj.length; x++) {
			name_splited = obj[x].name.split(/\[|\{|\.|\=/g);
			if ((index = obj[x].name.indexOf('=')) > -1) {
				name = name_splited[0];
				f2o_index = parseInt(obj[x].value);
				if (!group[name]) {
					group[name] = tmp_obj = {
						header : {},
						keys : {}

					};
				}
				tmp_obj = group[name];
				tmp_obj.header[f2o_index] = obj[x].name;
				obj[x] = null;
			}
		}
		
		

		for (var x = 0; x < obj.length; x++)
			if (obj[x]) {
				if (obj[x].name.search(/\[|\{|\./g) > -1) {
					group[obj[x].name.split(/\[|\{|\./g)[0]].keys[x] = obj[x].name;
				} else {
					object[obj[x].name] = obj[x].value;
				}
			}
			
			
		return {object:object,group:group,obj:obj};
	}
	
	
	
	return filterDefine;
});
