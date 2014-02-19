
var OrderedHash = function() {
var keys = [];
var values = {};

this.push = function(key, value) {
	if (values[key] === undefined) {
		keys.push(key);
	}
	values[key] = value;
};

this.length =function (){
	return keys.length;
};

this.value = function(key) {
	return values[key];
};

this.keys = function() {
	return keys;
};
}