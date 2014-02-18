
function PageCreator(pageNames) {
	var self = this;
	
	this.pageNumber = 1;
	this.totalNumberOfPage = pageNames.length;
	this.pageNameArray = pageNames;
	this.pageNameTemplate = "page";

	this.garmentID = -1;
	

	this.init = function() {
		var items;
		var prevButton;
		var htmlPage;

		this.sessionID = newSession("items");

		for (var i = 0; i < self.pageNameArray.length; i++) {
			items = {
				currentPage: i+1,
				totalNumberOfPage: self.totalNumberOfPage,
				title: self.pageNameArray[i].title,
				items: self.pageNameArray[i].values,
				pageHandler: self
			};
			
			htmlPage = new EJS({url: 'js/jmvc/view/page.ejs'}).render(items);
			$("body").append(htmlPage);
			$("body").find("button#nextButton")[i].onclick = self.goToNextPage;
			prevButton = $("body").find("button#prevButton")[i-1];
			if (prevButton != null) {
				prevButton.onclick = self.goToPrevPage;
			}
			if (i != 0) {
				$(self.getPage(i+1)).hide();
			}
		};


	},

	this.nextPageNumber = function() {
		var end = false;
		++self.pageNumber;
		if (self.pageNumber > self.pageNameArray.length) {
			self.pageNumber = self.pageNameArray.length;
			end = true;
		};

		console.debug("nextPageNumber: self.pageNumber = ", self.pageNumber, ", self.pageNameArray.length = ", self.pageNameArray.length, ", end = ", end);
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
			console.debug("existingDiv page = ", existingDivs[0], ", nextPage = ", nextPage);
			if (!nextPage.edge) {
				$(existingDivs[0]).hide();

				existingDivs = self.getCurrentPage();
				// show the next page	
				$(existingDivs[0]).show();
			}
			
		}
	},

	this.goToNextPage = function() {
		// if (self.garmentID < 0) {
		// 	self.garmentID = newGarment(self.sessionId);
		// 	console.debug("garmentID = ", self.garmentID);
		// }
		self.goToPage(self.nextPageNumber);
		
	},

	this.goToPrevPage = function() {
		self.goToPage(self.prevPageNumber);
	},

	this.setCurrentID = function(id) {
		self.id = id;
	}

	self.init();
}

PageCreator