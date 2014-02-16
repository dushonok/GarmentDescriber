

function Designer(name) {
	this.name = name;

	this.init = function(name) {
		this.setName(name);
	},
	this.getName = function() {
		return this.name;
	},

	this.setName = function(newName) {
		this.name = newName;
	}
};

var designers = 
	[
		new Designer("Betina Lou"),
		new Designer("Lili Graffitti"),
		new Designer("Packt"),
		new Designer("Sonia Paradis"),
		new Designer("Nadya Ershova"),
		new Designer("Shtukanchiki"),
	];

// Static
Designer.getAll = function() {
		return designers;
	}

