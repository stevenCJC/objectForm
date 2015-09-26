define(["jquery",'utils/objectForm/pickData'], function ($,pickData) {




	$.fn.objectFormValid=function(options){

		switch(options){
			case 'destroy':
				this.data('objectFormValid',null);
				this.find('input,select,textarea').off('change.objectFormValid');
				return;
			case 'valid':

				var data= pickData(this);
				var ok=true;

				for(var i=0;i<data.length;i++) if(data[i].check){
					var valid=validate(data[i].val,data[i].types);
					if(!valid.valid){
						errorTips(data[i].el,valid);
						ok=false;
					}else{
						clearTips(data[i].el);
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






	}



	function validate(val,types){

		var required=false;
		if(types&&types.length)for(var i=0;i<types.length;i++)if(types[i].type=='required') {
			required=true;
			if(!methods['required'](val)){
				return {valid:false, type:'required',param:undefined, value:val};
			}
		}


		if(val&&types&&types.length)for(var i=0;i<types.length;i++){
			if(!methods[types[i].type](val,types[i].param)){
				return {valid:false, type:types[i].type,param:types[i].param, value:val};
			}
		}

		return {valid:true};
	}

	function clearTips(el){
		$(el).removeClass('error');
		$(el).parent().find('label.error').remove();
	}

	function errorTips(el,valid){

		if($(el).hasClass('error')) clearTips(el);

		$(el).addClass('error');

		var msg = messages[valid.type];
		if (msg && valid.param) {
			var param = valid.param.split('-');
			msg = msg.replace(/\{\d\}/g, function (item) {
				return param[parseInt(item.replace(/\{|\}/, ''))];
			});
		}

		$(el).parent().append('<label class="error">' + msg + '</label>');

	}


	var messages= {
		required: "必选字段",
		remote: "请修正该字段",
		email: "请输入正确格式的电子邮件",
		url: "请输入合法的网址",
		date: "请输入合法的日期",
		dateISO: "请输入合法的日期 (ISO).",
		number: "请输入合法的数字",
		int: "只能输入整数",
		bool: '',
		float: '请填写带小数位的数字',
		creditcard: "请输入合法的信用卡号",
		//equalTo: "请再次输入相同的值",
		accept: "请输入拥有合法后缀名的字符串",
		maxlength: "请输入一个 长度最多是 {0} 的字符串",
		minlength: "请输入一个 长度最少是 {0} 的字符串",
		rangelength: "请输入 一个长度介于 {0} 和 {1} 之间的字符串",
		range: "请输入一个介于 {0} 和 {1} 之间的值",
		max: "请输入一个最大为{0} 的值",
		min: "请输入一个最小为{0} 的值"
	};

	var methods= {

		required: function (value) {

			if(value.constructor==Array)
				return value && value.length > 0;
			else
				return $.trim(value).length > 0;
		},

		email: function (value) {
			return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		},

		url: function (value) {
			return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},

		date: function (value) {
			return !/Invalid|NaN/.test(new Date(value).toString());
		},

		dateISO: function (value) {
			return /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
		},

		number: function (value) {
			return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
		},

		int: function (value) {
			return /^\d+$/.test(value);
		},

		float: function (value) {
			return /^\d+\.\d+$/.test(value);
		},
		bool: function (value) {
			return true;
		},

		creditcard: function (value) {

			// accept only spaces, int and dashes
			if (/[^0-9 \-]+/.test(value)) {
				return false;
			}
			var nCheck = 0,
				nDigit = 0,
				bEven = false;

			value = value.replace(/\D/g, "");

			for (var n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n);
				nDigit = parseInt(cDigit, 10);
				if (bEven) {
					if ((nDigit *= 2) > 9) {
						nDigit -= 9;
					}
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) === 0;
		},

		minlength: function (value, param) {
			var length = value.length ;
			return length >= param;
		},

		maxlength: function (value, param) {
			var length = value.length;
			return length <= param;
		},

		rangelength: function (value, param) {
			param=param.split('-');
			var length = value.length;
			return ( length >= param[0] && length <= param[1] );
		},

		min: function (value, param) {
			return  value >= param;
		},

		max: function (value, param) {
			return value <= param;
		},

		range: function (value, param) {
			param=param.split('-');
			return ( value >= param[0] && value <= param[1] );
		}


	}


});

