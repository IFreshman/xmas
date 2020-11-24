import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';

/// Bluetooth UUIDs
const service_uuid        = "fcf88392-048b-11ea-8d71-362b9e155667";
const controlChar_uuid    = "fcf88b58-048b-11ea-8d71-362b9e155667";
const colorChar_uuid      = "93783900-051a-11ea-8d71-362b9e155667";
const brightChar_uuid     = "5cd72205-09d2-4a58-b704-f59bca4bfc8c";

@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
})
export class ControlPage{
  segmentModel: string = "view";
  active: string;

  status: string = "on";
  light: string = "75";
  color: string = "220,0,116";

  background: string = "rgb(220,0,116)";

  peripheral: any = {};

  colorPicker(colors) {
    this.background = colors;
    this.color = this.background.match(/\d+/g).toString();
    this.active = 'none';
    //console.log(this.color, typeof(this.color));
    this.changeColor(this.color);
  }

  colorProfile(transC , name){
    this.active = name;
    this.color = transC;
    this.background = "rgb(" + transC + ")";
    //console.log(this.color, typeof(this.color));
    this.changeColor(this.color);
  }

  powerChanged(power){
    if(power.checked){
      this.status = "on";
    } else {
      this.status = "off";
    }
    this.changePowerMode(this.status);
  }

  brightnessChanged(){
    this.changeBrightness(this.status);
  }

  constructor(private router: Router, private ble: BLE, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.peripheral = this.router.getCurrentNavigation().extras.state.user;
      }
    });
  }
  
  Disconnect(){
    this.ble.disconnect(this.peripheral.id);
  }

  changePowerMode(value){
    var set = this.ble.read(this.peripheral.id, service_uuid, controlChar_uuid);  
    console.log(JSON.stringify(set));
    this.ble.write(
      this.peripheral.id, 
      service_uuid, 
      controlChar_uuid, 
      this.stringToBytes(value)
    );
  }

  changeBrightness(value){
    var set = this.ble.read(this.peripheral.id, service_uuid, brightChar_uuid);  
    console.log(JSON.stringify(set));
    this.ble.write(
      this.peripheral.id, 
      service_uuid, 
      brightChar_uuid,
      this.stringToBytes(value)
    );
  }

  changeColor(value){
    var set = this.ble.read(this.peripheral.id, service_uuid, colorChar_uuid);  
    console.log(JSON.stringify(set));
    this.ble.write(
      this.peripheral.id, 
      service_uuid,
      colorChar_uuid,
      this.stringToBytes(value)
    );
  }

  // ASCII only
  stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

  // ASCII only
  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }
}
