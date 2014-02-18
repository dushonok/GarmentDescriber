function RowHandler() {}

RowHandler.itemWasClicked = function(inputName, value, desc) {
		document.getElementById(inputName).value = desc;
		RowHandler.pageHandler.setCurrentID(value);
	}