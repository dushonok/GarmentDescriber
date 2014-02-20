function RowHandler() {}

var clickedValue;

RowHandler.itemWasClicked = function(inputName, takeInputValue) {
		var realValue = takeInputValue ? document.getElementById(inputName).value : clickedValue;
		RowHandler.pageHandler.setCurrentID(realValue);
		RowHandler.pageHandler.goToNextPage();
	}

RowHandler.setValue = function(inputName, value, valueToShow) {
	clickedValue = value;
	document.getElementById(inputName).value = valueToShow;
}