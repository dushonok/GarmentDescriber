
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
	for (var i in fieldKeys) {
		var fieldKey = fieldKeys[i]
		var deferred = Q.defer();
		promises.push(deferred);
		var values = listFieldValues(fieldKey, function() {
			console.debug("fieldKeys[i] = ", fieldKey, ", values = ", values);
			fullInfo.push(
				{
					title: fieldKey,
					values:  values
				}
			);
			deferred.resolve();
		});
		console.debug("values2 = ", values);
	}

	Q.all(promises).done(function(){

		var pageCreator = new PageCreator(
			[	
				{
					title: "Designers",
					values: Item.getAllDesigners()
				},
				{
					title: "Garment Type",
					values: []
				}
			]);
	});

	//pageCreator.goToNextPage();
	
	// for (var i = 0; i < designers.length; ++i) {
	// 	document.getElementById("button"+i).addEventListener("click", buttonWasClicked, false);
	// };
	
})();

