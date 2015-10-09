define(["jquery", 'pickData','filterDefine','evalText'], function ($, pickData, filterDefine, evalText) {

	$.fn.objectForm = function () {
		var data= pickData(this);
		var obj=filterDefine(data);
		evalText(obj);
		return obj.object;
	};

});
