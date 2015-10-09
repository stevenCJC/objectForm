define(["jquery"], function ($) {




	function typesSplit(types){
		
		if(types=='[]'||types=='array')return '[]';
		if(types=='{}'||types=='object')return '{}';
		
		if(!types) types=[];
		if(typeof types == 'string') types=types.replace(/\s/g,'').split(',');

		var result=[], tmp;
		for(var i=0;i<types.length;i++) if(types[i]&&(types[i]=types[i].toString().replace(/\s/g,''))){
			tmp=types[i].split(':');
			result.push({type:tmp[0],param:tmp[1]});
		}

		return result;
	}


	return typesSplit;
});

