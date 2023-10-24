import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //Pega o elemento com ID map do HTML
  @ViewChild('map') mapRef!: ElementRef;

  //Cria a variavel do Maps
  map!:google.maps.Map;

  constructor() {}

  async exibirMapa(){
    // The location of Uluru
  const position = { lat: -22.414871, lng: -48.728968 };

  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  // The map, centered at Uluru
  this.map = new Map(
    this.mapRef.nativeElement,
    {
      zoom: 14,
      center: position,
      mapId: 'DEMO_MAP_ID',
    }
  );

  //The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: this.map,
    position: position,
    title: 'Uluru'
  });
  
  }
  ionViewWillEnter(){
    this.exibirMapa();
  }

}
