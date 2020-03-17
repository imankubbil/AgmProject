import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title: string = 'AgmProject';
  latitude : number;
  longitude : number;
  zoom : number;
  address : string;
  map : any;
  mapCenter : any;
  private geoCoder;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.mapsAPILoader.load() .then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, { types: ["address"]
      });

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if(place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  private setCurrentLocation() {
    if('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  public getMapInstance(map) {
    this.map = map;
    console.log(map)
    console.log('idle')
  }

public updateMapCenter() {
    // this.mapCenter = {
      this.latitude = this.map.center.lat(),
      this.longitude = this.map.center.lng()
    // }
    console.log(this.map.center.lat());
    console.log(this.map.center.lng());
    console.log('update')
  }

  mapReady(evt) {
    console.log("map ready",evt);
    console.log("lat",evt.center.lat());
  }

  centerChange(ev) {
    var me = this;
    console.log("centre change called");
    console.log(me);
    // this.getPosition();
  }

  getPosition(){
    if (navigator.geolocation) {
      console.log("getPosition1")
      console.log(navigator.geolocation)
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)        
      this.latitude=position.coords.latitude+(0.0000000000100*Math.random());
      this.longitude=position.coords.longitude+(0.0000000000100*Math.random());
      console.log(this.latitude)
      console.log(this.longitude)
    });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
   }

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': {lat : latitude, lng : longitude}}, (results, status) => {
      console.log(results);
      console.log(status + ' Status');
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed ni' + status);
      }
    })
  }
}
