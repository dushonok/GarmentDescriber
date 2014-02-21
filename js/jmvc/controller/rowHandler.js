function RowHandler() {}

var clickedValue;


RowHandler.setValue = function(value, valueToShow, addToExisting) {
	clickedValue = value;
	if (addToExisting) {
		var fieldValue = document.getElementById(RowHandler.pageHandler.getCurrentInputName()).value;
		document.getElementById(RowHandler.pageHandler.getCurrentInputName()).value += fieldValue !== "" ? ", " : "";
		document.getElementById(RowHandler.pageHandler.getCurrentInputName()).value += valueToShow;
	} else {
		document.getElementById(RowHandler.pageHandler.getCurrentInputName()).value = valueToShow;
	}
}

RowHandler.saveValue = function(takeInputValue) {
	var realValue = takeInputValue ? 
		document.getElementById(RowHandler.pageHandler.getCurrentInputName()).value : 
		clickedValue;
	RowHandler.pageHandler.setCurrentID(realValue);
	clickedValue = "";
}

RowHandler.saveValueAndGoToNext = function(takeInputValue) {
	RowHandler.saveValue(takeInputValue);
	RowHandler.pageHandler.goToNextPage();
}

RowHandler.saveAndRestart = function(takeInputValue) {
	RowHandler.saveValue(takeInputValue);
	RowHandler.pageHandler.saveAndRestart();
}