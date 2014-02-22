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
	var realValue = isTakeInputValue ? 
		document.getElementById(inputName).value : 
		clickedValue;
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