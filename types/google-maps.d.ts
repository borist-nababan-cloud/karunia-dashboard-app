declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: google.maps.MapOptions) => google.maps.Map;
        MapOptions: google.maps.MapOptions;
        Marker: new (options?: google.maps.MarkerOptions) => google.maps.Marker;
        MarkerOptions: google.maps.MarkerOptions;
        InfoWindow: new (options?: google.maps.InfoWindowOptions) => google.maps.InfoWindow;
        InfoWindowOptions: google.maps.InfoWindowOptions;
        LatLngBounds: new () => google.maps.LatLngBounds;
        MapMouseEvent: {
          latLng: {
            lat: () => number;
            lng: () => number;
          };
        };
        SymbolPath: {
          CIRCLE: number;
        };
        places: {
          Autocomplete: new (input: HTMLInputElement, options?: google.maps.places.AutocompleteOptions) => google.maps.places.Autocomplete;
          AutocompleteOptions: google.maps.places.AutocompleteOptions;
        };
      };
      places: {
        Autocomplete: any;
        AutocompleteOptions: any;
      };
    };
  }
}

declare namespace google.maps {
  interface MapOptions {
    zoom?: number;
    center?: { lat: number; lng: number };
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
    [key: string]: any;
  }

  interface MarkerOptions {
    position?: { lat: number; lng: number };
    map?: Map | null;
    title?: string;
    icon?: string | MarkerIcon;
    draggable?: boolean;
    [key: string]: any;
  }

  interface MarkerIcon {
    path: string | number;
    scale?: number;
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeWidth?: number;
    [key: string]: any;
  }

  interface InfoWindowOptions {
    content?: string | Node;
    [key: string]: any;
  }

  interface LatLngBounds {
    extend(position: { lat: number; lng: number }): void;
    isEmpty(): boolean;
    [key: string]: any;
  }

  class Map {
    constructor(element: HTMLElement, options: MapOptions);
    fitBounds(bounds: LatLngBounds): void;
    [key: string]: any;
  }

  class Marker {
    constructor(options?: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(position: { lat: number; lng: number }): void;
    addListener(eventName: string, handler: Function): void;
    [key: string]: any;
  }

  class InfoWindow {
    constructor(options?: InfoWindowOptions);
    open(map: Map, anchor?: Marker): void;
    [key: string]: any;
  }
}

declare namespace google.maps.places {
  interface AutocompleteOptions {
    fields?: string[];
    types?: string[];
    [key: string]: any;
  }

  class Autocomplete {
    constructor(input: HTMLInputElement, options?: AutocompleteOptions);
    addListener(eventName: string, handler: Function): void;
    getPlace(): google.maps.places.PlaceResult;
    [key: string]: any;
  }

  interface PlaceResult {
    name: string;
    formatted_address: string;
    geometry?: {
      location: {
        lat: () => number;
        lng: () => number;
      };
    };
    [key: string]: any;
  }
}

export {};