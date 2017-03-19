var myLatLng = [
  {
      title: 'Favorite 1',
      des: 'Australia 1',
      lat: -5.363,
      lng: 131.044,
    },
    {
      title: 'Favorite 2',
      des: 'Australia 2',
      lat: -25.000,
      lng: 131.299,
    },
    {
      title: 'Favorite 3',
      des: 'Australia 3',
      lat: -24.998,
      lng: 121.200,
    },
    {
      title: 'Favorite 4',
      des: 'Australia 4',
      lat: -23.086,
      lng: 120.199,
    }
];

var map;

var mapItems = function (data) {
    var self = this;
    this.title = myLatLng.title;
    this.des = myLatLng.des;
    this.lat = myLatLng.lat;
    this.lng = myLatLng.lng;

    //create an observable to handle displaying markers on the map
    this.visible = ko.observable(true);
    //store the content for the markers to be displayed

    this.content = 'Filler Information!!!!';

    //create an instance of an infowindow
    this.info = new google.maps.InfoWindow({ content: self.content });

    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(myLatLng.lat, myLatLng.lng),
      map: map,
      title: myLatLng.title,
    });

    this.showMarkers = ko.computed(function () {
      if (this.visible() === true) {
        console.dir('Marker: ' + this.marker.setMap());
        this.marker.setMap(true);
      } else {
        console.log(this.marker);
        this.marker.setMap(null);
      }
      return true;
    }, this);
    //handle clicks on markers that are displayed
    this.marker.addListener(this.marker, 'click', function () {
      self.content = 'The location is: ' + data.title + ' info' + this.marker;

      this.info.setContent(self.content);
      self.info.open(map, this);
    });

    this.targeted = function(locs) {
      google.maps.event.trigger(self.marker, 'click');
    };

  };



function PageLinkViewModel() {

  var self = this;

  this.searchItem = ko.observable('');

  this.locList = ko.observableArray([]);

  //inital map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: { lat: -25.000, lng: 131.044 },
  });

  //create an instance of the mapdata per loclist
  myLatLng.forEach(function (locItem) {
    self.locList.push(new mapItems(locItem));
    console.log('Location Item: ' + locItem);
  });

  this.computedLocations = ko.computed(function () {
    var filtered = self.searchItem().toLowerCase();
    console.log('filtered item: ' + filtered);
    if (!filtered) {
      self.locList().forEach(function (locItem) {
        console.log('LocItem: ' + locItem);
        locItem.visible(true);
      });
      return self.locList();
    } else {
      return ko.utils.arrayFilter(self.locList(), function (locItem) {
        var string = locItem.title.toLowerCase();
        console.log('String Item: ' + string);
        var result = (string.search(filter) >= 0);
        locItem.visible(result);
        return result;
      });
    }
  }, self);

}

function initMap() {
  ko.applyBindings(new PageLinkViewModel());
}
