angular.module('starter').controller('MapController',
  [ '$scope',
    '$cordovaGeolocation',
    '$stateParams',
    '$ionicModal',
    '$ionicPopup',
    'LocationsService',
    'InstructionsService',
    function(
      $scope,
      $cordovaGeolocation,
      $stateParams,
      $ionicModal,
      $ionicPopup,
      LocationsService,
      InstructionsService
      ) {


      /**
       * Once state loaded, get put map on scope.
       */
      $scope.$on("$stateChangeSuccess", function() {

        $scope.locations = LocationsService.savedLocations;
        $scope.newLocation;

        if(!InstructionsService.instructions.newLocations.seen) {

          var instructionsPopup = $ionicPopup.alert({
            title: 'Add Locations',
            template: InstructionsService.instructions.newLocations.text
          });
          instructionsPopup.then(function(res) {
            InstructionsService.instructions.newLocations.seen = true;
            });

        }

        $scope.map = {
          defaults: {
            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            maxZoom: 18,
            zoomControlPosition: 'bottomleft'
          },
          markers : {},
          events: {
            map: {
              enable: ['context'],
              logic: 'emit'
            }
          }
        };

        $scope.goTo(0);

      });

      var Location = function() {
        if ( !(this instanceof Location) ) return new Location();
        this.lat  = "";
        this.lng  = "";
        this.name = "";
      };

      $ionicModal.fromTemplateUrl('templates/addLocation.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modal = modal;
        });

      /**
       * Detect user long-pressing on map to add new location
       */
      $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent){
        $scope.newLocation = new Location();
        $scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
        $scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
        $scope.modal.show();
      });

      $scope.saveLocation = function() {
        LocationsService.savedLocations.push($scope.newLocation);
        $scope.modal.hide();
        $scope.goTo(LocationsService.savedLocations.length - 1);
      };

      /**
       * Center map on specific saved location
       * @param locationKey
       */
      $scope.goTo = function(locationKey) {

        var location = LocationsService.savedLocations[locationKey];

        $scope.map.center  = {
          lat : location.lat,
          lng : location.lng,
          zoom : 12
        };


        var icon1 =   {
          iconUrl: 'img/lo.png',
          shadowUrl: 'img/ls.png',
          iconSize:     [38, 95],
          shadowSize:   [50, 64],
          iconAnchor:   [22, 94],
          shadowAnchor: [4, 62],
          popupAnchor:  [-3, -76]
        };

        if (locationKey % 2 == 0){
              icon1.iconUrl=  'img/a.png';
              icon1.shadowUrl = 'img/b.png';
              icon1.iconSize =   [50, 75];
              icon1.shadowSize =  [59, 44];
              icon1.iconAnchor = [26, 75];
              icon1.shadowAnchor = [8, 45];
        }


        $scope.map.markers[locationKey] = {
          lat:location.lat,
          lng:location.lng,
          message: location.name,
          icon: icon1,
          focus: true,
          draggable: true
        };

      };

      /**
       * Center map on user's current position
       */
      $scope.locate = function(){

        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            $scope.map.center.lat  = position.coords.latitude;
            $scope.map.center.lng = position.coords.longitude;
            $scope.map.center.zoom = 15;

              var icon1 =   {
                iconUrl: 'img/lo.png',
                shadowUrl: 'img/ls.png',
                iconSize:     [38, 95],
                shadowSize:   [50, 64],
                iconAnchor:   [22, 94],
                shadowAnchor: [4, 62],
                popupAnchor:  [-3, -76]
              };

            if (bla = true){
              icon1.iconUrl=  'img/a.png';
              icon1.shadowUrl = 'img/b.png';
              icon1.iconSize =   [50, 75];
              icon1.shadowSize =  [59, 44];
              icon1.iconAnchor = [26, 75];
              icon1.shadowAnchor = [8, 45];
            }
            else{}


            $scope.map.markers.now = {
              lat:position.coords.latitude,
              lng:position.coords.longitude,
              message: "You Are Here",
              icon:icon1,
              focus: true,
              draggable: false
            };
          }, function(err) {
            // error
            console.log("Location error!");
            console.log(err);
          });

      };

    }]);