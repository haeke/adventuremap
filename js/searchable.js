var myLatLng = [
  {
      title: 'Whitney Museum of American Art',
      des: 'Museum 1',
      lat: 40.739,
      lng: -74.008,
    },
    {
      title: 'The Metropolitan Museum of Art',
      des: 'Museum 2',
      lat: 40.779,
      lng: -73.963,
    },
    {
      title: 'American Museum of Natural History',
      des: 'Museum 3',
      lat: 40.781,
      lng: -73.974,
    },
    {
      title: 'The Museum of Modern Art',
      des: 'Museum 4',
      lat: 40.761,
      lng: -73.977,
    }
];

var map;

var mapItems = function (data) {
    var self = this;
    this.title = data.title;
    this.des = data.des;
    this.lat = data.lat;
    this.lng = data.lng;

    //create an observable to handle displaying markers on the map
    this.visible = ko.observable(true);

    //store the content for the markers to be displayed

    this.content = 'Filler Information!!!!';

    //create an instance of an infowindow
    this.info = new google.maps.InfoWindow({ content: self.content });

    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.lat, data.lng),
      map: map,
      title: data.title,
    });

    this.showMarkers = ko.computed(function () {
      if (this.visible() === true) {
        console.log(this.marker, null, 4);
        this.marker.setMap(map);
      } else {
        console.log(this.marker);
        this.marker.setMap(null);
      }
      return true;
    }, this);
    //handle clicks on markers that are displayed
    this.marker.addListener('click', function () {

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
    zoom: 13,
    center: { lat: 40.739, lng: -74.008 },
  });

  //create an instance of the mapdata per loclist
  myLatLng.forEach(function (locItem) {
    self.locList.push(new mapItems(locItem));
    console.log('Location Item: ', locItem);
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
        var result = (string.search(filtered) >= 0);
        locItem.visible(result);
        return result;
      });
    }
  }, self);

}

function initMap() {
  ko.applyBindings(new PageLinkViewModel());
}
