import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';

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

  listaEnderecos: google.maps.places.AutocompletePrediction[]=[];

  private autoComplete = new google.maps.places.AutocompleteService();
  private directions = new google.maps.DirectionsService();
  private directionsRender = new google.maps.DirectionsRenderer();

  minhaPosicao!: google.maps.LatLng; //Guarda nossa posição;

  constructor(private ngZone: NgZone) { }

  async exibirMapa(){
    // The location of Uluru
  const position = { lat: -22.414871, lng: -48.728968 };




  // The map, centered at Uluru
  this.map = new google.maps.Map(
    this.mapRef.nativeElement,
    {
      zoom: 16,
      center: position,
      mapId: 'DEMO_MAP_ID',
    }
  );



  this.buscarPosicao();

  }
  ionViewWillEnter(){
    this.exibirMapa();
  }

  async buscarPosicao(){
     const coordinates =await Geolocation.getCurrentPosition();
     console.log('Curent position:', coordinates)

     this.minhaPosicao =new google.maps.LatLng({
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
     });

     this.map.setCenter(this.minhaPosicao);
     this.map.setZoom(18);

     this.adicionarMarcador(this.minhaPosicao);
  }

  async adicionarMarcador(localizacao: google.maps.LatLng){
  
    //The marker, positioned at Uluru
    const marker = new google.maps.Marker({
    map: this.map,
    position: localizacao,
    title: 'Posição'
    });
  }
  //Busca o endereço no Maps
  buscarEndereco(valorBusca: any){
    //Pega os dados digitados no campo de busca
    const busca=valorBusca.target.value as string;

    //Comfere se não está vazio
    //Lembrando que 0 é igual a false
    if(!busca.trim().length){
      this.listaEnderecos = [];
      return false
    }
    this.autoComplete.getPlacePredictions(
      {input: busca}, //envia os dados para busca
      (arrayLocais, status) => { //variaveis com retorno
        if(status== 'OK'){ // Se o retorno estiver OK
          this.ngZone.run(()=>{ //Atualiza as diretivas da tela
            //Se tiver conteudo dentro do array atribui ele a lista
            this.listaEnderecos = arrayLocais ? arrayLocais: [];
            console.log(this.listaEnderecos);
          });
        }else{
          // Se o retorno deu erro, limpa a lista
          this.listaEnderecos = [];
        }
      }
    );
    return true;
  }

  //Converte o endereço de texto para a posição no GPS
  public tracarRota(local: google.maps.places.AutocompletePrediction){
    this.listaEnderecos=[];
    new google.maps.Geocoder().geocode({address: local.description}, resultado=>{
        const localizacao = resultado![0].geometry.location;

        this.adicionarMarcador(localizacao); //Adiciona o marcador no novo local

      //Cria uma rota
      const rota: google.maps.DirectionsRequest = {
        origin:this.minhaPosicao,
        destination: resultado![0].geometry.location,
        unitSystem: google.maps.UnitSystem.METRIC,
        travelMode: google.maps.TravelMode.DRIVING
      };

      //Desenha a rota no mapa.
      this.directions.route(rota, (resultado, status)=>{
        if(status == 'OK'){
          this.directionsRender.setMap(this.map);
          this.directionsRender.setOptions({suppressMarkers: true});
          this.directionsRender.setDirections(resultado);
        }
      });
    });
  }
}
