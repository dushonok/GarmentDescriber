function RowHandler() {}

RowHandler.itemWasClicked = function(value) {
		console.debug("itemWasClicked, value = ", value);
		document.getElementById("input").value = value.name;
		//pageHandler.setCurrentID(value.id);
	}