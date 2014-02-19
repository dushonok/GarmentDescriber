
function PageCreator(pageNames) {
	var self = this;

	this.pageNameOrderedHash = pageNames;
	
	this.pageNumber = 1;
	this.totalNumberOfPage = this.pageNameOrderedHash.length();
	
	this.pageNameTemplate = "page";
	RowHandler.pageHandler = self;

	this.row = {
		garmentID: -1
	};
	

	this.init = function() {
		var items;
		var prevButton, startOverButton;
		var htmlPage;

		this.sessionID = newSession("items");

		for (var i = 0; i < self.totalNumberOfPage; i++) {
			var key = self.pageNameOrderedHash.keys()[i];
			var value = self.pageNameOrderedHash.value(key);
			items = {
				currentPage: i+1,
				totalNumberOfPage: self.totalNumberOfPage,
				title: key,
				items: value
			};
			
			htmlPage = new EJS({url: 'js/jmvc/view/page.ejs'}).render(items);
			$("body").append(htmlPage);
			$("body").find("button#nextButton")[i].onclick = self.goToNextPage;
			prevButton = $("body").find("button#prevButton")[i];
			if (prevButton != null) {
				prevButton.onclick = self.goToPrevPage;
			}

			startOverButton = $("body").find("button#saveAndRestartButton")[0];
			if (startOverButton != null) {
				startOverButton.onclick = self.saveAndRestart;
			}

			if (i != 0) {
				$(self.getPage(i+1)).hide();
			}
		};


		self.row = {
			garmentID: newGarment(self.sessionId)
		};
		
		
	},

	this.nextPageNumber = function() {
		var end = false;
		++self.pageNumber;
		if (self.pageNumber > self.totalNumberOfPage) {
			self.pageNumber = self.totalNumberOfPage;
			end = true();
		};

		return {
			edge: end,
			pageNumber: self.pageNumber
		};
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
			//}
			
		}
	},

	this.goToNextPage = function() {
		self.saveFields();
		self.goToPage(self.nextPageNumber);
	},

	this.goToPrevPage = function() {
		self.goToPage(self.prevPageNumber);
		self.loadFields();
	},

	this.setCurrentID = function(id) {
		console.debug("setCurrentID, id = ", id);
		self.id = id;
	},

	this.saveFields = function() {
		var name = self.pageNameOrderedHash.keys()[self.pageNumber-1];
		self.row[name] = self.id;
		saveField(self.sessionID, self.row.garmentID, name, self.id);
	},

	this.loadFields = function() {
		// var val = getField(self.sessionID, self.row.garmentID, key);
		// console.debug("stored val = ", val);
		// self.row.
		// RowHandler.itemWasClicked("input" + self.currentPage, val, val);
	},

	this.saveAndRestart = function() {
		if (self.row.garmentID >= 0) {
			// add desc - TEMP
			saveField(self.sessionID, self.row.garmentID, "description", "test from tool");
			//save
			console.debug("save now");
			uploadGarment(self.sessionID, self.row.garmentID, function(result) {
				console.debug("result = ", result);
				// go to 1st page
				self.goToPage(self.firstPageNumber);				
				self.row = {
					garmentID: newGarment(self.sessionId)
				};
				console.debug("garmentID = ", self.row.garmentID);
			})
		}
		
	},

	self.init();
}

PageCreator