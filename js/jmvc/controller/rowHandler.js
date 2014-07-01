function RowHandler() {}

var clickedValue;
var previousValue = {};

RowHandler.usePrevious = function() {
	var inputName = RowHandler.pageHandler.getCurrentInputName();
	var xs = previousValue[inputName];
	if (xs) {
		RowHandler.setValue(xs[0], xs[1], xs[2]);
	}
}

RowHandler.setValue = function(value, valueToShow, addToExisting) {
	var inputName = RowHandler.pageHandler.getCurrentInputName();
	previousValue[inputName] = [value, valueToShow, addToExisting];
	clickedValue = value;
	
	if (addToExisting) {
		var fieldValue = document.getElementById(inputName).value;
		if (fieldValue !== "" && fieldValue !== undefined) {
			document.getElementById(inputName).value += ", ";
		}
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

// Navigation 

RowHandler.usePreviousAndGoToNext = function() {
	RowHandler.usePrevious();
	RowHandler.saveValueAndGoToNext();
}

RowHandler.saveValueAndGoToNext = function() {
	history.pushState({"id":RowHandler.pageHandler.pageNumber}, document.title, location.href);
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
