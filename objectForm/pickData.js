define(["jquery",'utils/objectForm/typesSplit'], function ($,typesSplit) {



		return function($el){
			var obj=[];
			$el.find('input,select,textarea').not('[disabled]').each(function(index_, element) {

				var index,define_,tmp,types,name,value;

				var $this=$(this);

				types=typesSplit($this.attr('of-type')); // int float bool

				name=$this.attr('of-name');

            	if(name) {
					if(this.tagName.toLowerCase()=='select'){
						if(this.multiple){
							tmp=value=[];
							$(this).children(':selected').each(function(index, element) {
								tmp.push(convert(this.value,types));
							});
						}else{
							value=convert(this.value,types);
						}
					}else if(
						(this.type.toLowerCase()=='radio'||this.type.toLowerCase()!='checkbox')&&this.checked||
						(this.type.toLowerCase()!='radio'&&this.type.toLowerCase()!='checkbox')) {
						value=convert(this.value,types);
					}else{
						value=convert(this.value,types);
					}

				}else if((index=$(this).attr('index'))&&(define_=$(this).attr('of-define'))){
					value=parseInt(index);
					name=define_;
				}



				if(name)
					obj.push({
						el:this,
						name:name,
						value:value,
						val:this.value||'',
						check:(this.type.toLowerCase() != 'hidden')&&types&&types.length,
						types:types
					});

			});

			return obj;
		};
		
		function convert(val,types){
			for(var i=0;i<types.length;i++)
				switch(types[i].type){
					case 'int':
					return parseInt(val)||0;
					case 'number':
					return (val&&(val=val.replace(/,/g,'')).indexOf('.')>-1?parseFloat(val):parseInt(val))||0;
					case 'float':
						return parseFloat(val)|0;
					case 'bool':
					return !!val;
				}
			return val.toString();
		}
		

});
	



