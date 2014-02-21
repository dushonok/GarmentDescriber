function RowHandler() {}

var clickedValue;


RowHandler.setValue = function(inputName, value, valueToShow, addToExisting) {
	clickedValue = value;
	if (addToExisting) {
		var fieldValue = document.getElementById(inputName).value;
		document.getElementById(inputName).value += fieldValue !== "" ? ", " : "";
		document.getElementById(inputName).value += valueToShow;
	} else {
		document.getElementById(inputName).value = valueToShow;
	}
}

RowHandler.saveValue = function(inputName, takeInputValue) {
	var realValue = takeInputValue ? document.getElementById(inputName).value : clickedValue;
	RowHandler.pageHandler.setCurrentID(realValue);
}

RowHandler.saveValueAndGoToNext = function(inputName, takeInputValue) {
	RowHandler.saveValue(inputName, takeInputValue);
	RowHandler.pageHandler.goToNextPage();
}

RowHandler.saveAndRestart = function(inputName, takeInputValue) {
	RowHandler.saveValue(inputName, takeInputValue);
	RowHandler.pageHandler.saveAndRestart();
}