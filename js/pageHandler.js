
function PageCreator(pageTotal, pageNames) {
	this.pageNumber = 1;
	this.totalNumberOfPage = pageTotal;
	this.pageNameArray = pageNames;

	this.nextPageNumber = function() {
		var end = false;
		++pageNumber;
		if (pageNumber > pageNameArray.length) {
			pageNumber = pageNameArray.length;
			end = true;
		}
		return {
			edge: end,
			pageNumber: pageNumber
		};
	},

	this.prevPageNumber = function() {
		var begin = false;
		--pageNumber;
		if (pageNumber < 1) {
			pageNumber = 1;
			begin = true;
		}

		return {
			edge: begin,
			pageNumber: pageNumber
		};
	},

	this.goToNextPage = function() {
		var designers = {
			currentPage: this.pageNumber,
			totalNumberOfPage: this.totalNumberOfPage,
			clickHandler: "RowHandler.designerWasClicked",
			title: "Designers",
			items: Item.getAllDesigners()
		};

		var htmlDesigners = new EJS({url: 'view/page.ejs'}).render(designers);
		$("body").append(htmlDesigners);
	},

	this.goToPrevPage = function() {
		;
	}
}