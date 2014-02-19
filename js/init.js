
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
	

	var collectValues = function(array, title, values) {
		array.push(
			{
				title: title,
				values:  values
			}
		);
	};

	var fullInfo = [];
	var vendors = [];
	for (var i= 0; i < fieldKeys.length; ++i) {
		(function(){
			var fieldKey = fieldKeys[i]
			var deferred = Q.defer();
			
			listFieldValues(fieldKey, function(values){
				//console.debug("success, values = ", values);
				if (fieldKey === "Vendor") {
					vendors = values;
				}
				collectValues(fullInfo, fieldKey, values );
				//console.debug("resolving defered");
				deferred.resolve(true);
			});

			promises.push(deferred.promise);
		}());
	}

	var callback = function(){

		var orderedPages = new OrderedHash();

		orderedPages.push("Vintage / New", 
				["vintage", "new"]);

		orderedPages.push("Vendor", vendors);

		orderedPages.push("Description", []);

		orderedPages.push("Size", 
			[	
				"Size 1",
				"Size 2",
				"Size 4",
				"Size 6",
				"Size 8",
				"Size 10",
				"Size 12",
				"Size 14"] );

		console.debug("all done, fullInfo = ", fullInfo);
		console.debug("orderedPages = ", orderedPages);

		var pageCreator = new PageCreator(orderedPages);
	};
	console.debug("promises = ", promises);
	Q.all(promises).then(callback);

})();

