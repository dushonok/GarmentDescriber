
var UtilFunctions = function(){}

UtilFunctions.removeSpaces = function(str) {
	var pattern = /\s/g;
	var res = str.replace(pattern, "-");
	pattern = /\//g;
	res = res.replace(pattern, "");
	return res;
};

UtilFunctions.arrayToHash = function(array, hash) {
	for (var i = 0; i < array.length; i++) {
		hash[UtilFunctions.removeSpaces(array[i])] = array[i];
	};
};

UtilFunctions.isEmpty = function(map) {
   for(var key in map) {
      if (map.hasOwnProperty(key)) {
         return false;
      }
   }
   return true;
}