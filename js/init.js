
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
		console.debug("fieldKeys[i] = ", title, ", array = ", array);
		
	};

	var fullInfo = [];
	for (var i= 0; i < fieldKeys.length; ++i) {
		(function(){
			var fieldKey = fieldKeys[i]
			var deferred = Q.defer();
			
			listFieldValues(fieldKey, function(values){
				//console.debug("success, values = ", values);
				collectValues(fullInfo, fieldKey, values );
				//console.debug("resolving defered");
				deferred.resolve(true);
			});

			promises.push(deferred.promise);
		}());
	}

	var callback = function(){
		
		console.debug("all done, fullInfo = ", fullInfo);

		var pageCreator = new PageCreator(fullInfo);
	};
	console.debug("promises = ", promises);
	Q.all(promises).then(callback);

	//pageCreator.goToNextPage();
	
	// for (var i = 0; i < designers.length; ++i) {
	// 	document.getElementById("button"+i).addEventListener("click", buttonWasClicked, false);
	// };
	
})();

