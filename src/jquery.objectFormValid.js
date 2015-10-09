define(["jquery",'pickData','var/messages','var/methods'], function ($, pickData, messages, methods) {




	$.fn.objectFormValid=function(options){

		switch(options){
			case 'destroy':
				this.data('objectFormValid',null);
				this.find('input,select,textarea').off('.objectFormValid');
				return;
			case 'valid':

				var data= pickData(this);
				var ok=true,sign,label,type;

				for(var i=0;i<data.length;i++) if(data[i].check){
					var valid=validate(data[i].val,data[i].types,data[i]);
					//console.log(valid,data[i]);

					sign=signs[valid.type];

					if(!valid.valid){
						label=errorSigns(data[i].el,valid);
						if(sign) sign($(data[i].el),data[i].val,valid.param,valid.valid,label);
						ok=false;
					}else{
						label=clearSigns(data[i].el);
						//表明有清理动作执行，即之前验证不正确
						for(var j=0;j<data[i].types.length;j++) {
							type=data[i].types[j].type;
							if(signs.hasOwnProperty(type)){
								signs[type]($(data[i].el),data[i].val,data[i].types[j].param,true);
							}
						}

					}
				}
				return ok;

		}

		var event='';
		if(options&&options.events){

			var self=this;

			event=options.events.split(/\,|\s/g).join('.objectFormValid ');

			this.on(event,'input,select,textarea',function(){
				self.objectFormValid('valid');
			});

		}

	};


	var signs={},methodsExtended={};

	// $.validExtend('unique',function($el,val,params){},function($el,val,params,valid,label){},'massage');
	$.validExtend=function(name,method,sign,message){
		/*if(messages[name]||methods[name]||signs[name]) {
			throw 'the message or method or signs should be unique.';
			return;
		}*/
		if(message) massages[name]=message;
		if(method) methodsExtended[name]=method;
		if(sign) signs[name]=sign;

	};



	function validate(val, types, obj){

		var required=false;
		if(types&&types.length) for(var i=0;i<types.length;i++) if(types[i].type=='required') {
			required=true;
			if(!methods['required']($(obj.el),val)){
				var info= {valid:false, type:'required',param:undefined, value:val};
				console.info(info);
				return info;
			}
		}

		if(val&&types&&types.length) for(var i=0;i<types.length;i++) if(methods[types[i].type]){
			if(!methods[types[i].type]($(obj.el), val, types[i].param)){
				var info= {valid:false, type:types[i].type,param:types[i].param, value:val};
				console.info(info);
				return info;
			}
		}

		if(types&&types.length) for(var i=0;i<types.length;i++) if(methodsExtended[types[i].type]){
			if(!methodsExtended[types[i].type]($(obj.el), val, types[i].param)){
				var info= {valid:false, type:types[i].type,param:types[i].param, value:val};
				console.info(info);
				return info;
			}
		}

		return {valid:true};
	}

	function clearSigns(el){
		if($(el).hasClass('error')){
			$(el).removeClass('error');
			var $label=$(el).next('label.error');
			if($label.length){
				$label.remove();
				return $label;
			}
		}else return;

	}

	function errorSigns(el,valid){
		var $label=makeLabel(valid);
		if($(el).hasClass('error')) clearSigns(el);
		$(el).addClass('error');
		if($label){
			$(el).after($label);
			return $label;
		}

	}

	function makeLabel(valid){

		var msg = messages[valid.type];
		if (msg && valid.param) {
			var param = valid.param.split('-');
			msg = msg.replace(/\{\d\}/g, function (item) {
				return param[parseInt(item.replace(/\{|\}/, ''))];
			});

		}

		if(msg) return $('<label class="error">' + msg + '</label>');
	}


	


});

