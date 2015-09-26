define(["jquery",'utils/objectForm/pickData'], function ($,pickData) {



		$.fn.objectForm=function(){
			return objectForm(pickData(this));
		};
		

		function objectForm(obj){
			
			var object={};
			var text='';
			var group={};



			var index,f2o_index,tmp_obj,name,name_splited;
			for(var x=0;x<obj.length;x++) {
				name_splited=obj[x].name.split(/\[|\{|\.|\=/g);
				if((index=obj[x].name.indexOf('='))>-1){
					name=name_splited[0];
					f2o_index=parseInt(obj[x].value);
					if(!group[name]){
						group[name]=tmp_obj={header:{},keys:{}};
					}
					tmp_obj=group[name];
					tmp_obj.header[f2o_index]=obj[x].name;
					obj[x]=null;
				}
			}



			for(var x in obj) if(obj[x]){
				if(obj[x].name.search(/\[|\{|\./g)>-1){
					group[obj[x].name.split(/\[|\{|\./g)[0]].keys[x]=obj[x].name;
				}else{
					object[obj[x].name]=obj[x].value;
				}
			}

			var item,var_,shim_text;
			text='(function(object,src_obj){';
			for(var x in group){
				
				item=group[x];
				
				for(var h in item.header) {
					if(h==0)
						text+='object["'+x+'"]=(function(){var '+item.header[h]+';';
					else text+=item.header[h]+';';
				}

				for(var k in item.keys) text+=item.keys[k]+'=src_obj['+k+'].value;';
				shim_text='';
				for(var h in item.header) 
					if(item.header[h].indexOf('=[]')>-1){
						var_=item.header[h].replace(/\=\[\]/,'');
						shim_text=var_+'=shimArr('+var_+')'+';'+shim_text;
					}
				
				text+=shim_text+'return '+x+';})();';
			}
			
			text+='function shimArr(arr){if(arr&&arr.constructor==Array){var a=[];for(var x in arr)a.push(arr[x]);return a;}else return arr;}';
			
			text+='})(object,obj)';
			try{
				eval(text);
			}catch(e){
				throw 'Err: please check out the index or lack of define';
			}

			return object;
		}
});
	

	
	/*
	
	
	console.log(form2object({
		'id':123,
		'aaa=[]':0,
		'aaa[0]':1,
		'aaa[1]':1,
		'bbb={}':0,
		'bbb.bb=[]':1,
		'bbb.bb[0]':'123',
		'bbb.bb[1]':'123',
		'ccc=[]':0,
		'ccc[0]={}':1,
		'ccc[0].c1':'c1',
		'ccc[0].c2':'c2',
		'ccc[1]={}':2,
		'ccc[1].c1':'c11',
		'ccc[1].c2':'c22',
	}));
	
	//生成自动执行的字符串如下
	(function (object) {
		object["aaa"] = (function () {
			var aaa = [];
			aaa[0] = "1";
			aaa[1] = "1";
			aaa = shimArr(aaa);
			return aaa;
		})();
		object["bbb"] = (function () {
			var bbb = {};
			bbb.bb = [];
			bbb.bb[0] = "123";
			bbb.bb[1] = "123";
			bbb.bb = shimArr(bbb.bb);
			return bbb;
		})();
		object["ccc"] = (function () {
			var ccc = [];
			ccc[0] = {};
			ccc[1] = {};
			ccc[0].c1 = "c1";
			ccc[0].c2 = "c2";
			ccc[1].c1 = "c11";
			ccc[1].c2 = "c22";
			ccc = shimArr(ccc);
			return ccc;
		})();
		function shimArr(arr) {
			if (arr && arr.constructor == Array) {
				var a = [];
				for (var x in arr)a.push(arr[x]);
				return a;
			} else return arr;
		}
	})(object)
	
	*/














