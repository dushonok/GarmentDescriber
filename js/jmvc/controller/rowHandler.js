function RowHandler() {}

RowHandler.itemWasClicked = function(inputName, id, value) {
		console.debug("itemWasClicked, value = ", value);
		document.getElementById(inputName).value = value;
		//pageHandler.setCurrentID(value.id);
	}