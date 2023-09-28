let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(data){
    console.log(data);
    Feature(data.features)
});


//creatiing functions for marker size and color
//marker size is dependent on the magnitude value of the earthquake
function Size(magnitude){
    return magnitude * 5;
}

// color has gradient of green(lighter shade green = lower depth)(darker shade of green = higher depth)
function Color(depth){
    if (depth > -10 & depth <= 10) {
        return "#2BD500";
    } else if(depth > 10 & depth <= 30){
        return "#55AA00";
    } else if(depth > 30 & depth <= 50){
        return "#808000";
    } else if(depth > 50 & depth <= 70 ){
        return "#AA5500";
    } else if(depth > 70 & depth <= 90){
        return "#D52A00";
    } else if(depth >90){
        return "#FF0000";
    }
    
}


//creating circleMarker that will adjust size according to mangnitude of earthquake and color gradient according to depth of earthquake
function marker(feature, latlng){
    return L.circleMarker(latlng,{
        radius: Size(feature.properties.mag),
        fillcolor: Color(feature.geometry.coordinates[2]),
        color: Color(feature.geometry.coordinates[2]),
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 1
    });
}

function Feature(data){
    function popUp(feature, layer){
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`)
    }
       
    let earthquakeLayer = L.geoJSON(data,{
       onEachFeature: popUp,
        pointToLayer: marker
    });

    createMap(earthquakeLayer);
}

function createMap(earthquakeLayer){
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let myMap = L.map("map",{
       center: [37.09, -95.71],
       zoom: 5,
       layers: [street, earthquakeLayer]
    });

    let legend = L.control({position:'bottomright'});

    legend.onAdd = function(){
        let div = L.DomUtil.create("div", "info legend"),
            labels = ['<strong>Legend</strong>'];
            let gradientColor = ["#2BD500", "#55AA00","#808000","#AA5500","#D52A00","#FF0000" ]
            let depthRange = ['-10-10', '10-30', '30-50', '50-70','70-90', '90+']

        for (let i = 0; i < depthRange.length; i++) {
            labels.push(
                `<i style="background:${gradientColor[i]}"></i> ${depthRange[i]}`
            );
        }
        div.innerHTML = labels.join('<br>');
        return div;
        };
        legend.addTo(myMap);
}

