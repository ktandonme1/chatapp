
// create our angular app and inject ngAnimate and ui-router 
// =============================================================================
angular.module('formApp', ['ngAnimate', 'ui.router'])

// configuring our routes 
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    
        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: 'form.html',
            controller: 'formController'
        })
        
        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('form.profile', {
            url: '/profile',
            templateUrl: 'form-profile.html'
        })
        
        // url will be /form/interests
        .state('form.interests', {
            url: '/interests',
            templateUrl: 'form-interests.html'
        })
        
        // url will be /form/payment
        .state('form.payment', {
            url: '/payment',
            templateUrl: 'form-payment.html'
        });
       
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/form/profile');
})

// our controller for the form
// =============================================================================
.controller('formController', ['$scope', '$http', '$timeout', '$window', function($scope,$http,$timeout,$window) {
    
    // we will store all of our form data in this object
    $scope.formData = {};
	$scope.zipcity=null;

    
    // function to process the form
    $scope.processForm = function() {
        alert('awesome!');  
    };

	$scope.showUserValidation=false;
	$scope.userIDValidation = function(){
		if ($scope.formData.name.length<=5){
			$scope.showUserValidation=true;
			$scope.validationMessage='UserID cannot be less than 6 characters!';
		}
	}

	$scope.checkUniqueID = function (){
		$scope.showUserValidation=false;
		$scope.showGreen=false;
		$scope.showAlreadyExists=false;
		if ($scope.formData.name.length>5)
		{
				var postdata = JSON.stringify({"query":{"term": {"userid": {"value": $scope.formData.name}}}});
				$http.post('http://localhost:9200/chatapp/userids/_search',postdata)
					.success(function (data) {
							console.log("HERE4");
							var dataj=JSON.parse(JSON.stringify(data));
							var count = dataj.hits.total;
							if (count==0){
								$scope.showGreen=true;
							}else
							{
								$scope.showAlreadyExists=true;
							}
					})
		}
	};

	$scope.getCity = function (){
		if ($scope.formData.zip.length>=3)
		{
				var postdata = JSON.stringify({"query":{"term": {"Zipcode": {"value": $scope.formData.zip}}}});
				$http.post('http://localhost:9200/chatapp/cityzipcodes/_search',postdata)
					.success(function (data) {
							console.log("HERE5");
							var dataj=JSON.parse(JSON.stringify(data));
							var count = dataj.hits.total;
							if (count>0){
							var city = dataj.hits.hits[0]._source.City+', '+dataj.hits.hits[0]._source.State;
							console.log(city);
							$scope.zipcity=city;
							}
						
					})
		}
	};

	$scope.createUser = function(){
		if (validateFormData($scope.formData))
		{		
				var postdata = JSON.stringify($scope.formData);
/*				var postdata = JSON.stringify({
										"userid":formData.name,
										"dobdd": formData.dob.dd,
										"dobmm": formData.dob.mm,
										"dobyyyy": formData.dob.yyyy,
										"zip": formData.zip,
										"email": formData.email,
										"aboutme":formData.aboutme,
										"gametype": formData.type
									});
*/
				$http.post('http://localhost:9200/chatapp/userprofiles/',postdata)
					.success(function (data) {
							console.log("User created");
							$window.location.href = 'home.html';
					})
					.error(function (data) {
							console.log("Error in user creation: "+JSON.stringify(data));
					});
		}
		else{
				console.log("Form Validation failed");
		}
	};

	var validateFormData = function(){
		console.log('Inside validate function');
		return true;
	}
    
}]);


