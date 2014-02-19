
var UtilFunctions = function(){}

UtilFunctions.removeSpaces = function(str) {
	var pattern = /\s/g;
	var res = str.replace(pattern, "");
	return res;
};

UtilFunctions.arrayToHash = function(array, hash) {
	for (var i = 0; i < array.length; i++) {
		hash[UtilFunctions.removeSpaces(array[i])] = array[i];
	};
};
