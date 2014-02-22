function RowHandler() {}

var clickedValue;


RowHandler.setValue = function(value, valueToShow, addToExisting) {
	var inputName = RowHandler.pageHandler.getCurrentInputName();
	clickedValue = value;
	
	if (addToExisting) {
		var fieldValue = document.getElementById(inputName).value;
		document.getElementById(inputName).value += fieldValue !== "" ? ", " : "";
		document.getElementById(inputName).value += valueToShow;
	} else {
		document.getElementById(inputName).value = valueToShow;
	}
}

RowHandler.saveValue = function() {
	var inputName = RowHandler.pageHandler.getCurrentInputName();
	var isTakeInputValue = RowHandler.pageHandler.isCurrentTakeInputValue();
	var inputValue = document.getElementById(inputName).value;
	var realValue = isTakeInputValue ? inputValue : clickedValue;
	if (RowHandler.pageHandler.isConsignorPage()) {
		realValue = UtilFunctions.removeSpaces(inputValue);
	}
	RowHandler.pageHandler.setCurrentFieldValue(realValue);
	clickedValue = "";
}

RowHandler.saveValueAndGoToNext = function() {
	RowHandler.saveValue();
	RowHandler.pageHandler.goToNextPage();
}

RowHandler.goToPrev = function() {
	RowHandler.pageHandler.goToPrevPage();
}

RowHandler.saveAndRestart = function() {
	RowHandler.saveValue();
	RowHandler.pageHandler.saveAndRestart();
}