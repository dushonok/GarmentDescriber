
function PageCreator(pageTotal, pageNames) {
	this.pageNumber = 1;
	this.totalNumberOfPage = pageTotal;
	this.pageNameArray = pageNames;
	this.pageNameTemplate = "page";
	var self = this;
		

	this.nextPageNumber = function() {
		var end = false;
		++self.pageNumber;
		if (self.pageNumber > self.pageNameArray.length) {
			self.pageNumber = self.pageNameArray.length;
			end = true;
		}
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

	this.goToNextPage = function() {
		var items = {
			currentPage: this.pageNumber,
			totalNumberOfPage: this.totalNumberOfPage,
			clickHandler: "RowHandler.designerWasClicked",
			title: "Designers",
			items: Item.getAllDesigners(),
			pageHandler: this
		};

		var existingDivs = $("body").find("div#" + self.pageNameTemplate + self.pageNumber);
		console.debug("existingDiv = ", existingDivs[0]);
		if (existingDivs.length === 0) {
			var htmlPage = new EJS({url: 'view/page.ejs'}).render(items);
			$("body").append(htmlPage);
			$("body").find("button#nextButton")[0].onclick = self.goToNextPage;
		} else {
			var nextPage = self.nextPageNumber();
			console.debug("nextPage = ", nextPage);
			if (!nextPage.edge) {
				$(existingDivs[0]).hide();
				// show the next page	
			}
			
		}
	},

	this.goToPrevPage = function() {
		;
	}
}