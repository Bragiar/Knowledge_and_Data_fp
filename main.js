angular.module('KRRclass', [ 'chart.js']).controller('MainCtrl', ['$scope','$http', mainCtrl]);

items = [];





function mainCtrl($scope, $http, ChartJsProvider){
	$scope.mysparqlendpoint = "http://localhost:7200/repositories/test?query="

	/// TEST

	/// TEST END


	$scope.sparqlqueryGetAllIngredients = 'SELECT DISTINCT ?ingr ?name WHERE {?s <http://example.org/final_project/hasIngredient> ?ingr . ?ingr <http://xmlns.com/foaf/0.1/name> ?name .}';

	$scope.ingrResults;
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
	$scope.items = 	$scope.allIngredients;

	console.log($scope.dataFruit);



  $scope.dataFruit = null;

  $scope.setDataFruit = function(fruit) {
		console.log($scope.dataFruit);
  $scope.dataFruit = fruit;
  }

	console.log($scope.allIngredients);
	//items = $scope.allIngredients
	//document.getElementById('myUL').appendChild(makeUL(items));



	// use a third variable if you want to visualise labels
	$scope.selectedIngredients = [];

	$scope.select_item = function(item){
		console.log(item)
		$scope.selectedIngredients.push(item);
	}

	$scope.clearSelectedItems = function(){
		$scope.selectedIngredients = [];
	}

	$scope.searchByIngredients

	$scope.cocktailsDetails = [];




	$scope.searchForCocktailsINGR = function() {
		console.log("searching for cocktails...")
		console.log($scope.selectedIngredients)
		query = 'SELECT ?cocktail ?name WHERE {'
		for (var i = 0; i < $scope.selectedIngredients.length; i++) {
			query += ' ?cocktail <http://example.org/final_project/hasIngredient> <' + $scope.selectedIngredients[i].uri + '>. ?cocktail <http://xmlns.com/foaf/0.1/name> ?name .'
		}
		query += "}"

		$scope.searchByIngredients = query
		console.log(query)
		console.log('calling ')

		//Call the database
		$scope.allCocktails = [];
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

							let newCocktail = new Object();
							newCocktail.uri = val.cocktail.value;
							newCocktail.name = val.name.value;
							console.log('adding cocktail' + val.cocktail.value)
							$scope.allCocktails.push(newCocktail);

						});
				//getdataaboutcocktail(data)
			      // TODO : your code here
		  })
			.error(function(error ){
			    console.log('Error '+error);
			});
		}


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

	// ###################### Question 6
	// Create an interaction with the triplestore by filling the following method
	// The function needs to include : some arguments sent by the html + an http call to the sparql endpoint + a variable storing the results to be visualised
	// use the native function encodeURI(mySparqlQuery) to encode your query as a URL
	let allcock = []
  $scope.fireInteraction = function(){
		console.log('calling ')
    $scope.result = "Here is my input: " +$scope.searchByIngredients;  // =  TODO

		console.log($scope.mysparqlendpoint+encodeURI($scope.searchByIngredients).replace(/#/g, '%23'));
    $http( {
		 	method: "GET",
			url : $scope.mysparqlendpoint + encodeURI($scope.searchByIngredients).replace(/#/g, '%23'), // TODO : your endpoint + your query here,
			headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'}
			} )
			.success(function(data, status ) {
				console.log('Got cocktails from database');
        console.log(data);
				$scope.allCocktails = []
        allcock.push(data);
			      // TODO : your code here
		  })
			.error(function(error ){
					console.log('Failure getting cocktails from database');
			    console.log('Error '+error);
			});

		$scope.results = "Here is my input: " +$scope.myInput+"!";  // =  TODO

	};
	//document.getElementById('myUL').appendChild(makeUL(items));
}

// Add the contents of options[0] to #foo:
//document.getElementById('myUL').appendChild(makeUL(items));
