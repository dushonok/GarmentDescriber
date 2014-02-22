
(function(){
	// $(window).keydown(function(e) {
	//     switch (e.keyCode) {
	//         case 37: case 38:  //key is left or up
	//             if (currImage <= 1) {break;} //if is the first one do nothing
	//             goToPrev(); // function which goes to previous image
	//             return false; //"return false" will avoid further events
	//         case 39: case 40: //key is left or down
	//             if (currImage >= maxImages) {break;} //if is the last one do nothing
	//             goToNext(); // function which goes to next image
	//             return false; //"return false" will avoid further events
	//     }
	//     return; //using "return" other attached events will execute
	// });

	var promises = [];
	var fieldKeys = listFieldKeys();
	

	var fullInfo = [];
	var vendors, consignors, categories, manufacturers;
	for (var i= 0; i < fieldKeys.length; ++i) {
		(function(){
			var fieldKey = fieldKeys[i]
			var deferred = Q.defer();
			
			listFieldValues(fieldKey, function(values){
				//console.debug("success, values = ", values);
				if (fieldKey === "Vendor") {
					vendors = values;
				} else if (fieldKey === "Consignors") {
					consignors = values;
				} else if (fieldKey === "Category") {
					categories = values;
					for(var key in categories)
				    {
				    	var value = categories[key];
				    	var re = /\//;
				    	if (value.match(re) == null) {
				    		delete categories[key];
				    	}
				    }
				    //categories.sort();
				} else if (fieldKey === "Manufacturer") {
					manufacturers = values;
				}
				//console.debug("resolving defered");
				deferred.resolve(true);
			});

			promises.push(deferred.promise);
		}());
	}

	var callback = function(){

		var orderedPages = new OrderedHash();
		var fieldRealNames = {};
		
		// real field names
		fieldRealNames[PageCreator.vintageNewFieldName] = PageCreator.manufacturerFieldName;
		fieldRealNames[PageCreator.consignorFieldName] = PageCreator.tagsFieldName;
		fieldRealNames[PageCreator.sizeNewFieldName] = PageCreator.tagsFieldName;
		fieldRealNames[PageCreator.defaultCostFieldName] = "DefaultCost";
		fieldRealNames[PageCreator.msrpFieldName] = "Msrp";
		

		orderedPages.push(PageCreator.categoryFieldName, categories);

		orderedPages.push(PageCreator.vintageNewFieldName, {
			"2":"vintage", 
			"": "new"
		});


		orderedPages.push(PageCreator.consignmentFieldName, {
			0: "no",
			1: "yes"
		});

		
		orderedPages.push(PageCreator.vendorFieldName, vendors);
		orderedPages.push(PageCreator.consignorFieldName, consignors);

		orderedPages.push(PageCreator.descriptionFieldName, {});

		var sizes =
			[	
				"Size XS",
				"Size S",
				"Size M",
				"Size L",
				"Size XL",
				"Size XXL"];

		var sizesHash = {};
		UtilFunctions.arrayToHash(sizes, sizesHash);
		orderedPages.push(PageCreator.sizeNewFieldName, sizesHash);	

		orderedPages.push(PageCreator.priceFieldName, {});
		//orderedPages.push(PageCreator.msrpFieldName, {});
		orderedPages.push(PageCreator.defaultCostFieldName, {});
		orderedPages.push(PageCreator.quantityFieldName, {});

		var tags = [
				"men",
				"basic",
				"colourful",
				"online",
				"spring-summer",
				"fall-winter"
		];
		var tagsHash = {};
		UtilFunctions.arrayToHash(tags, tagsHash);
		orderedPages.push(PageCreator.tagsFieldName, tagsHash);

		orderedPages.push("Notes", {});

		console.debug("all done, orderedPages = ", orderedPages);

		var pageCreator = new PageCreator(orderedPages, fieldRealNames);
		
		// don't refresh the page when Enter is pressed
		$("form").submit(function(e) {
			e.preventDefault();
		});
		
		registerShortcuts({
			"LEFT": function() {
				RowHandler.goToPrev();
			},
			"RIGHT": function() {
				RowHandler.saveValueAndGoToNext();
			},
			"ENTER": function() {
				RowHandler.saveValueAndGoToNext();
			}
		});
	};
	console.debug("promises = ", promises);
	Q.all(promises).then(callback);

})();

