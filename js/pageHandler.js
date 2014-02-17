
function PageCreator(pageTotal, pageNames) {
	var self = this;
	
	this.pageNumber = 1;
	this.totalNumberOfPage = pageTotal;
	this.pageNameArray = pageNames;
	this.pageNameTemplate = "page";
	

	this.init = function() {
		var items;

		for (var i = 0; i < self.pageNameArray.length; i++) {
			items = {
				currentPage: i+1,
				totalNumberOfPage: self.totalNumberOfPage,
				clickHandler: "self.itemWasClicked",
				title: self.pageNameArray[i].title,
				items: self.pageNameArray[i].values
			};
			var htmlPage = new EJS({url: 'view/page.ejs'}).render(items);
			$("body").append(htmlPage);
			$("body").find("button#nextButton")[0].onclick = self.goToNextPage;
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

	this.itemWasClicked = function(value) {
		console.debug("designer, value = ", value.id);
		document.getElementById("input").value = value.name;
		this.id = value.id;
	},

	this.getPage = function(number) {
		return $("body").find("div#" + self.pageNameTemplate + number);
	},


	this.getCurrentPage = function() {
		return getPage(self.pageNumber);
	},

	this.goToNextPage = function() {
		// var items = {
		// 	currentPage: self.pageNumber,
		// 	totalNumberOfPage: self.totalNumberOfPage,
		// 	clickHandler: "self.itemWasClicked",
		// 	title: "Designers",
		// 	items: Item.getAllDesigners(),
		// 	pageHandler: self
		// };

		// var existingDivs = self.getCurrentPage();
		// console.debug("existingDiv = ", existingDivs[0]);
		// if (existingDivs.length === 0) {
		// 	var htmlPage = new EJS({url: 'view/page.ejs'}).render(items);
		// 	$("body").append(htmlPage);
		// 	$("body").find("button#nextButton")[0].onclick = self.goToNextPage;
		// } else {
		// 	var nextPage = self.nextPageNumber();
		// 	if (!nextPage.edge) {
		// 		$(existingDivs[0]).hide();

		// 		// TODO: refactor
		// 		items = {
		// 			currentPage: self.pageNumber,
		// 			totalNumberOfPage: self.totalNumberOfPage,
		// 			clickHandler: "self.itemWasClicked",
		// 			title: "Designers",
		// 			items: Item.getAllDesigners(),
		// 			pageHandler: self
		// 		};
		// 		existingDivs = self.getCurrentPage();
		// 		// show the next page	
		// 		var htmlPage = new EJS({url: 'view/page.ejs'}).render(items);
		// 		$("body").append(htmlPage);
		// 		$("body").find("button#nextButton")[0].onclick = self.goToNextPage;
		// 	}
			
		// }
	},

	this.goToPrevPage = function() {
		;
	}

	self.init();
}