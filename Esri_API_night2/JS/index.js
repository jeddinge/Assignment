require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/MapImageLayer",
    "esri/widgets/Legend",
    "esri/widgets/LayerList",
    "esri/widgets/Search",
    "esri/widgets/ScaleBar",
    "esri/widgets/BasemapGallery",
    "esri/tasks/Locator",
    "esri/widgets/Popup",
    "dojo/domReady!"], function (Map,
        MapView,
        FeatureLayer,
        MapImageLayer,
        Legend, LayerList,
        Search, ScaleBar,
        BasemapGallery,
        Locator,
        Popup) {
    //my code starts here

    var mapConfig = {
        basemap: "streets-night-vector"
    };

    var myMap = new Map(mapConfig);

    var mapView = new MapView({
        map: myMap,
        container: "viewDiv",
        center: [-75.1652, 39.9526],
        zoom: 12
    });
    var dynamic = new MapImageLayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer"
    });
    myMap.add(dynamic);


    var fwySym = {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: "##FF0000",
        width: 3,
        style: "short-dash-dot-dot"
    };
    // Symbol for U.S. Highways
    var hwySym = {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: "#00FF00",
        width: 3,
        style: "long-dash"
    };
    // Symbol for other major highways
    var otherSym = {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: "#7d0052",
        width: 3,
        style: "short-dot"
    };
    var hwyRenderer = {
        type: "unique-value", // autocasts as new UniqueValueRenderer()
        defaultSymbol: otherSym,
        defaultLabel: "Other major roads",
        field: "CLASS",
        uniqueValueInfos: [{
            value: "I", symbol: fwySym, label: "Interstates"
        },
            { value: "U", symbol: hwySym, label: "US Highways" }
        ]
    };
    hwyRenderer.legendOptions = {
        title: "Classification (high/low)"
    }
        var template = { // autocasts as new PopupTemplate()
            title: "USA Major Highways",
            content: "<p>This is Highway, <b>{ROUTE_NUM}</b> which has a length of {DIST_MILES} miles.</p>",
        };


    var myFeatureLayer = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Freeway_System/FeatureServer/2",
        renderer: hwyRenderer
    });
    myMap.add(myFeatureLayer);

    var legend = new Legend({
        view: mapView,
        layerInfos: [{ layer: myFeatureLayer, title: 'Highway Systems' }]
    });
    mapView.ui.add(legend, "bottom-left");
    var layerList = new LayerList({
        view: mapView
    });
    // Adds widget below other elements in the top left corner of the view
    mapView.ui.add(layerList, {
        position: "top-right"
    });
//Search Widget
    var searchWidget = new Search({
        view: mapView,
        sources: [{
            locator: new Locator({ url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
            singleLineFieldName: "SingleLine",
            name: "Custom Geocoding Service",
            localSearchOptions: {
                minScale: 300000,
                distance: 50000
            },
            placeholder: "Search Geocoder",
            maxResults: 3,
            maxSuggestions: 6,
            suggestionsEnabled: false,
            minSuggestCharacters: 0
        }, {
            featureLayer: myFeatureLayer,
            searchFields: ["ROUTE_NUM"],
            displayField: "ROUTE_NUM",
            exactMatch: false,
            outFields: ["*"],
            name: "My Custom Search",
            placeholder: "example: C18",
            maxResults: 6,
            maxSuggestions: 6,
            suggestionsEnabled: true,
            minSuggestCharacters: 0
        },]
    });
    // Adds the search widget below other elements in
    // the top left corner of the view
    mapView.ui.add(searchWidget, {
        position: "top-left",
        index: 2
    });
    var scaleBar = new ScaleBar({
        view: mapView
    });
    // Add widget to the bottom left corner of the view
    mapView.ui.add(scaleBar, {
        position: "bottom-right"
    });

    var basemapGallery = new BasemapGallery({
        view: mapView
    });
    // Add widget to the bottom left corner of the view
    mapView.ui.add(basemapGallery, {
        position: "top-right"
    });



    //my code ends here
});