define(["jquery"], function ($) {



		$.fn.objectForm=function(){
			var obj={};
			this.eq(0).find('input,select,textarea').each(function(index, element) {
				var index,define_,tmp,dataType;
				var $this=$(this);
				dataType=$this.attr('of-type');// int float bool
				
            	if(this.name) {
					if(this.tagName.toLowerCase()=='select'&&this.multiple){
						tmp=obj[this.name]=[];
						$(this).children(':selected').each(function(index, element) {
                            tmp.push(convert(this.value,dataType));
                        });
					}else if(
						(this.type.toLowerCase()=='radio'||this.type.toLowerCase()!='checkbox')&&this.checked||
						(this.type.toLowerCase()!='radio'&&this.type.toLowerCase()!='checkbox')) 
						obj[this.name]=convert(this.value,dataType);
				}else if((index=$(this).attr('index'))&&(define_=$(this).attr('of-define')))
					obj[define_]=parseInt(index);
			});
			return objectForm(obj);
		};
		
		function convert(val,type){
			switch(type){
				case 'int':
				return parseInt(val)||0;
				case 'float':
				return parseFloat(val)||0;
				case 'bool':
				return !!val;
				case 'string':
				return val.toString();
			}
			return val.toString();
		}
		
		function objectForm(obj){
			
			var object={};
			var text='';
			var group={};
			var index,f2o_index,tmp_obj,name;
			for(var x in obj) {
				if((index=x.indexOf('='))>-1){
					name=x.split(/\[|\{|\.|\=/g)[0];
					f2o_index=parseInt(obj[x]);
					if(!group[name]){
						tmp_obj={header:{},keys:{}};
						group[name]=tmp_obj;
					}
					tmp_obj=group[name];
					tmp_obj.header[f2o_index]=x;
					delete obj[x];
				}
			}
			
			for(var x in obj) {
				if(x.search(/\[|\{|\./g)>-1){
					group[x.split(/\[|\{|\./g)[0]].keys[x]=obj[x];
				}else{
					object[x]=obj[x];
				}
			}
			var item,var_,shim_text;
			text='(function(object,src_obj){';
			for(var x in group){
				
				item=group[x];
				
				for(var h in item.header) 
					if(h==0)
						text+='object["'+x+'"]=(function(){var '+item.header[h]+';';
					else text+=item.header[h]+';';
					
				for(var k in item.keys) text+=k+'=src_obj["'+k+'"];';
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













