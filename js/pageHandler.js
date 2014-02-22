
function PageCreator(pageNames, fieldRealNames) {
	var self = this;

	this.pageNameOrderedHash = pageNames;
	this.fieldRealNames = fieldRealNames;
	
	this.pageNumber = 1;
	this.totalNumberOfPage = this.pageNameOrderedHash.length();
	
	this.pageNameTemplate = "page";
	this.inputNameTemplate = "input";
	this.onConsingment = false;
	this.isVintage = false;
	RowHandler.pageHandler = self;

	this.row = {
		garmentID: -1
	};
	

	this.init = function() {
		var items;
		var prevButton, startOverButton;
		var htmlPage;

		self.initValues();
		window.localStorage.clear();
		self.sessionID = newSession("items");

		for (var i = 0; i < self.totalNumberOfPage; i++) {
			var key = self.getFieldNameByNumber(i);
			var value = self.pageNameOrderedHash.value(key);
			items = {
				pageHandler: self,
				currentPage: i+1,
				totalNumberOfPage: self.totalNumberOfPage,
				title: key,
				items: value,
				addToExisting: key === PageCreator.tagsFieldName,
				hint: PageCreator.hints[UtilFunctions.removeSpaces(key)]
			};
			
			htmlPage = new EJS({url: 'js/jmvc/view/page.ejs'}).render(items);
			$("body").append(htmlPage);
			
			if (i != 0) {
				$(self.getPage(i+1)).hide();
			}
		};


		self.row = {
			garmentID: newGarment(self.sessionID)
		};
		
		
	},

	this.clickDigitButton = function(j) {
		var i = RowHandler.pageHandler.pageNumber;
		$("#page"+i+" #button"+(j-1)).click();
	},
	this.appendDigit = function(i) {
		self.digits = self.digits * 10 + i;
		self.clickDigitButton(self.digits);
	},
	
	this.initValues = function() {
		self.onConsingment = false;	
		this.isVintage = false;
		self.digits = 0;
		PageCreator.clearFields();
	},

	this.isVendorPage = function() {
		return self.getFieldNameByNumber(self.pageNumber-1) === PageCreator.vendorFieldName;
	},

	this.isConsignorPage = function() {
		return self.getFieldNameByNumber(self.pageNumber-1) === PageCreator.consignorFieldName;
	},

	this.isTagsPage = function() {
		return self.getFieldNameByNumber(self.pageNumber-1) === PageCreator.tagsFieldName;
	},

	

	this.firstPageNumber = function() {
		var end = true;
		self.pageNumber = 1;

		return {
			edge: end,
			pageNumber: self.pageNumber
		};
	},


	this.nextPageNumber = function() {
		var end = false;
		++self.pageNumber;

		if (self.isVintage && self.isVendorPage() ) {
			++self.pageNumber;
		}

		if ( self.onConsingment && self.isVendorPage() ) {
			++self.pageNumber;
		}
		if (!self.onConsingment && self.isConsignorPage() ) {
			++self.pageNumber;
		}

		if (self.pageNumber > self.totalNumberOfPage) {
			self.pageNumber = self.totalNumberOfPage;
			end = true;
		};

		return {
			edge: end,
			pageNumber: self.pageNumber
		};
	},

	this.prevPageNumber = function() {
		var begin = false;
		--self.pageNumber;
		
		if (!self.onConsingment && self.isConsignorPage() ) {
			--self.pageNumber;
		}

		if (self.isVintage && self.isVendorPage() ) {
			--self.pageNumber;
		}

		if (self.onConsingment && self.isVendorPage() ) {
			--self.pageNumber;
		} 

		
		if (self.pageNumber < 1) {
			self.pageNumber = 1;
			begin = true;
		}

		return {
			edge: begin,
			pageNumber: self.pageNumber
		};
	},

	this.itemWasClicked = function(value) {
		console.debug("itemWasClicked, value = ", value.id);
		document.getElementById("input").value = value.name;
		self.id = value.id;
	},

	this.getPage = function(number) {
		return $("body").find("div#" + self.pageNameTemplate + number);
	},


	this.getCurrentPage = function() {
		return self.getPage(self.pageNumber);
	},

	this.goToPage = function(funcToGoToPage){
		var existingDivs = self.getCurrentPage();
		if (existingDivs.length != 0) {
			var nextPage = funcToGoToPage();
			
			//if (!nextPage.edge) {
				$(existingDivs[0]).hide();

				existingDivs = self.getCurrentPage();
				// show the next page	
				$(existingDivs[0]).show();
				
				// clear page-local variables
				self.digits = 0;
			//}
			
		}
	},

	this.goToNextPage = function() {
		self.saveFields();
		self.goToPage(self.nextPageNumber);
		self.getFullDesc();
	},

	this.goToPrevPage = function() {
		self.goToPage(self.prevPageNumber);
		self.loadFields();
	},

	this.setCurrentFieldValue = function(id) {
		self.id = id;
	},

	this.getFieldNameByNumber = function(fieldNumber) {
		return self.pageNameOrderedHash.keys()[fieldNumber];
	},

	this.getRealFieldName = function(name) {
		Object.keys(self.fieldRealNames).forEach(function (key) { 
			if (name === key) {
				name = self.fieldRealNames[key];
			}
		});
		return name;
	}

	this.saveFields = function() {
	
		var displayName = self.getFieldNameByNumber(self.pageNumber-1);
		var name = self.getRealFieldName(displayName);

		var inputName = self.getCurrentInputName();
		self.row[UtilFunctions.removeSpaces(displayName)] = 
								document.getElementById(inputName).value;
		
		if (name === PageCreator.consignmentFieldName) {
			self.onConsingment = self.id === "1";
		} else {
			if (name === PageCreator.tagsFieldName) {
				var prevVal = getField(self.sessionID, self.row.garmentID, name);
				
				if (prevVal != undefined) {
					self.id += ", ";
					self.id += prevVal;
				}
			} else if (name === PageCreator.manufacturerFieldName ) {
				self.isVintage = self.id != "";
			}
			console.debug("Save field: display name = ", displayName, ", real name = ", name, ", value = ", self.id);
			
			if (self.id !== "") {
				saveField(self.sessionID, self.row.garmentID, name, self.id);
			}
			self.id = "";
		}
	},

	this.loadFields = function() {
		// var val = getField(self.sessionID, self.row.garmentID, key);
		// console.debug("stored val = ", val);
		// self.row.
		// RowHandler.itemWasClicked("input" + self.currentPage, val, val);
	},

	this.saveAndRestart = function() {
		if (self.row.garmentID >= 0) {
			//save
			console.debug("save now");
			uploadGarment(self.sessionID, self.row.garmentID, function(result) {
				console.debug("result = ", result);
				if (result.httpCode == undefined) {
					self.initValues();
					// go to 1st page
					self.goToPage(self.firstPageNumber);
					self.row = {};			
					self.row = {
						garmentID: newGarment(self.sessionID)
					};
					console.debug("garmentID = ", self.row.garmentID);
				}
			})
		}
		
	},

	this.getCurrentInputName = function() {
		return self.inputNameTemplate + self.pageNumber;
	},

	this.isCurrentTakeInputValue = function() {
		var key = self.getFieldNameByNumber(self.pageNumber-1);
		var value = self.pageNameOrderedHash.value(key);
		return UtilFunctions.isEmpty(value) || self.isTagsPage();
	},

	this.getFullDesc = function() {
		var txt = "Description of the item: ";

		var value = self.row[PageCreator.categoryFieldName];
		if (value != undefined) {
			txt += value;
		}

		value = self.row[UtilFunctions.removeSpaces(PageCreator.vintageNewFieldName)];
		if (value != undefined) {
			txt += ", ";
			txt += value + " item";
		}

		value = self.row[UtilFunctions.removeSpaces(PageCreator.consignmentFieldName)];
		if (value != undefined) {
			txt += value === "yes" ? ", on consignment" : "";
		}

		value = self.row[UtilFunctions.removeSpaces(PageCreator.consignorFieldName)];
		if (value != undefined) {
			txt += " from ";
			txt += value;
		}

		value = self.row[UtilFunctions.removeSpaces(PageCreator.vendorFieldName)];
		if (value != undefined) {
			txt += " by ";
			txt += value;
		}


		value = self.row[UtilFunctions.removeSpaces(PageCreator.descriptionFieldName)];
		if (value != undefined) {
			txt += ", description in Fre: '";
			txt += value + "'";
		}

		value = self.row[UtilFunctions.removeSpaces(PageCreator.sizeFieldName)];
		if (value != undefined) {
			txt += ", ";
			txt += value;
		}

		value = self.row[UtilFunctions.removeSpaces(PageCreator.priceFieldName)];
		if (value != undefined) {
			txt += ", price $";
			txt += value;
		}


		value = self.row[UtilFunctions.removeSpaces(PageCreator.defaultCostFieldName)];
		if (value != undefined) {
			txt += ", default cost $";
			txt += value;
		}


		value = self.row[UtilFunctions.removeSpaces(PageCreator.quantityFieldName)];
		if (value != undefined) {
			txt += ", quantity: ";
			txt += value;
		}


		value = self.row[UtilFunctions.removeSpaces(PageCreator.tagsFieldName)];
		if (value != undefined) {
			txt += ", tags: '";
			txt += value + "'";
		}

		value = self.row[UtilFunctions.removeSpaces(PageCreator.notesFieldName)];
		if (value != undefined) {
			txt += ", notes: '";
			txt += value + "'";
		}
		//txt += getField(self.sessionID, self.row.garmentID, );
		$("p#fullDesc").html(txt);
	},

	self.init();
}

PageCreator.clearFields = function() {
	$(".form-control").val("");
}


PageCreator.manufacturerFieldName = "Manufacturer";
PageCreator.consignmentFieldName = "Consignment";
PageCreator.vendorFieldName = "Vendor";
PageCreator.consignorFieldName = "Consignor";
PageCreator.tagsFieldName = "Tags";

PageCreator.descriptionFieldName = "Description";
PageCreator.priceFieldName = "Price";
PageCreator.msrpFieldName = "MSRP";
PageCreator.defaultCostFieldName = "Default Cost";
PageCreator.quantityFieldName = "Quantity";
PageCreator.categoryFieldName = "Category";
PageCreator.vintageNewFieldName = "Vintage / New";
PageCreator.sizeFieldName = "Size";
PageCreator.notesFieldName = "Notes";
<<<<<<< HEAD

PageCreator.hints = {}
=======
>>>>>>> 829fdeb1e7a8e5811d775bff6ad97f55799da6ea
