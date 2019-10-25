angular.module('KRRclass', [ 'chart.js']).controller('MainCtrl', ['$scope','$http', mainCtrl]);

function mainCtrl($scope, $http, ChartJsProvider){
	$scope.mysparqlendpoint = "http://localhost:7200/repositories/test?query="

	/// TEST

	/// TEST END


	$scope.sparqlqueryGetAllIngredients = 'SELECT DISTINCT ?ingr ?name WHERE {?s <http://example.org/final_project/hasIngredient> ?ingr . ?ingr <http://xmlns.com/foaf/0.1/name> ?name .}';


	$scope.allIngredients = [];

	console.log($scope.endpoint+encodeURI($scope.sparqlqueryGetAllIngredients).replace(/#/g, '%23'));
			$http( {
			method: "GET",
			headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'},
			url : $scope.mysparqlendpoint + encodeURI($scope.sparqlqueryGetAllIngredients).replace(/#/g, '%23'),

	} )
	.success(function(data, status ) {

			console.log(data);
			$scope.ingrResults=data;
//        angular.foreach(data, function(value, key){
//            this.push(key +  ' ', value)
//        })
	angular.forEach(data.results.bindings, function(val)
			{
				console.log('adding ingr' + val.ingr.value)
				let newIngredient = new Object();
				newIngredient.uri = val.ingr.value;
				newIngredient.name = val.name.value;
				$scope.allIngredients.push(newIngredient);

			})
	})

	//  SELECTED INGREDIENTS
	$scope.selectedIngredients = [];

	$scope.latestIngredient;

	$scope.select_item = function(item){
		console.log(item)
		let alreadySelected = false
		for (var i = 0; i < $scope.selectedIngredients.length; i++) {

			if (item  == $scope.selectedIngredients[i]) {
				alreadySelected = true;
				break;
			}
		}
		if (!alreadySelected) {
			$scope.latestIngredient = item;
			$scope.selectedIngredients.push(item);
			$scope.searchForCocktailsINGR();
		}
	}

	// CLEAR SELECTED INGREDIENTS
	$scope.clearSelectedItems = function(){
		$scope.selectedIngredients = [];
		$scope.allCocktails = [];
	}


	$scope.cocktailsDetails = [];

	$scope.allCocktails = [];

	// SEARCH FOR COCKTAILS
	$scope.searchForCocktailsINGR = function() {
		console.log("searching for cocktails...")
		console.log($scope.selectedIngredients)
		query = 'SELECT ?cocktail ?name WHERE {'
			query += ' ?cocktail <http://example.org/final_project/hasIngredient> <' + $scope.latestIngredient.uri + '>. ?cocktail <http://xmlns.com/foaf/0.1/name> ?name .'
		query += "}"

		$scope.searchByIngredients = query
		console.log(query)
		console.log('calling ')

		//Call the database
		$http( {
		 	method: "GET",
			url : $scope.mysparqlendpoint + encodeURI($scope.searchByIngredients), // TODO : your endpoint + your query here,
			headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'}
			} )
			.success(function(data, status ) {
        console.log(data);

				angular.forEach(data.results.bindings, function(val)
						{
							console.log(val);
							let cocktailInDatabase = false;
							for (var i = 0; i < $scope.allCocktails.length; i++) {
								if(val.cocktail.value == $scope.allCocktails[i].uri){
									$scope.allCocktails[i].matches += 1;
									cocktailInDatabase = true;
									break;
								}
							}
							if(!cocktailInDatabase){
								let newCocktail = new Object();
								newCocktail.uri = val.cocktail.value;
								newCocktail.name = val.name.value;
								newCocktail.matches = 1;
								console.log('adding cocktail' + val.cocktail.value)
								$scope.allCocktails.push(newCocktail);

							}
						});
			      // TODO : your code here
		  })
			.error(function(error ){
			    console.log('Error '+error);
			});
		}


		// SELECT COCKTAIL

		$scope.select_cocktail = function(cocktail){
			console.log(cocktail)
				cocktail = '<' + cocktail.uri + '>'

				let intr;
				let img;
				query = 'SELECT ?instr ?img ?ingr ?name WHERE { '
				 + cocktail + '<http://dbpedia.org/property/prep>' + '?instr .'
				 + cocktail + '<http://example.org/final_project/hasPicture>' + '?img .'
			 		+ cocktail + ' <http://example.org/final_project/hasIngredient> ' + '?ingr . ?ingr <http://xmlns.com/foaf/0.1/name> ?name }';
				 console.log('query for cocktail cocktail Details')
				 console.log(query);
				 $http( {
		 		 	method: "GET",
		 			url : $scope.mysparqlendpoint + encodeURI(query), // TODO : your endpoint + your query here,
		 			headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'}
		 			} )
		 			.success(function(data, status) {
		         console.log(data);
						 $scope.cocktailDetails = new Object();
						 $scope.cocktailDetails.instructions = data.results.bindings[0].instr.value
						 $scope.cocktailDetails.image = data.results.bindings[0].img.value
						 $scope.cocktailDetails.ingredients = [];
		 					angular.forEach(data.results.bindings, function(val)
		 						{

		 							$scope.cocktailDetails.ingredients.push(val.name.value);

		 						});
		 				//getdataaboutcocktail(data)
		 			      // TODO : your code here
		 		  })
		 			.error(function(error ){
		 			    console.log('Error '+error);
		 			});
			}

}
