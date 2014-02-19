
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

		orderedPages.push("Vintage / New", {
			"2":"vintage", 
			"": "new"
		});

		orderedPages.push("Vendor", vendors);
		orderedPages.push("Consignor", consignors);

		orderedPages.push("Description", {});

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
		orderedPages.push("Size", sizesHash);		

		console.debug("all done, orderedPages = ", orderedPages);

		var pageCreator = new PageCreator(orderedPages);
	};
	console.debug("promises = ", promises);
	Q.all(promises).then(callback);

})();

