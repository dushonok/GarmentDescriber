
function RowHandler() {}

RowHandler.designerWasClicked = function(value) {
		console.debug("designer, value = ", value.id);
		document.getElementById("input").value = value.name;
		this.id = value.id;
	}
