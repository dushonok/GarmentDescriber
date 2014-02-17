

function Item(id, name) {
	this.name = name;
	this.id = id;

	this.getID = function() {
		return this.id;
	},

	this.getName = function() {
		return this.name;
	}
};

var designers = 
	[
		new Item(1, "Betina Lou"),
		new Item(2, "Lili Graffitti"),
		new Item(3, "Pact"),
		new Item(4, "Sonia Paradis"),
		new Item(5, "Nadya Ershova"),
		new Item(6, "Shtukanchiki"),
		new Item(7, "Uranium"),
	];

// Static
Item.getAllDesigners = function() {

		return designers;
	}



