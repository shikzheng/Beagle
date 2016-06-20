/**
 * Created by cristianfelix on 2/18/16.
 */
import React from 'react';
import d3 from 'd3'
import topojson from 'topojson'
import world from '../../Data/world-topo-min'
import { PropTypes } from 'react';
import { Map, Marker, Popup, TileLayer, Path, Circle, CircleMarker } from 'react-leaflet';
import 'leaflet.markercluster';
import {renderToStaticMarkup} from 'react-dom/server'
class WorldMap extends React.Component {
    constructor() {
        super();
        this.zoom = 65;
        this.translate = [190,140];
        this.state = {
            dragging: false
        }
        this.position = {
            x: 0,
            y: 0
        }
    }

    zoomIn() {
        this.zoom *= 1.2;
        this.computeBase();
        this.forceUpdate();
    }

    zoomOut() {
        this.zoom /= 1.2;
        this.computeBase();
        this.forceUpdate();
    }

    computeBase() {
        let {summary, height, width} = this.props;

        var projection = d3.geo.mercator().scale(this.zoom).translate(this.translate),
            graticule = d3.geo.graticule();

        var path = d3.geo.path()
            .projection(projection);

        var countries = topojson.feature(world, world.objects.countries).features,
            neighbors = topojson.neighbors(world.objects.countries.geometries);
        this.countries = countries;
        let style = {
            country:{
                fill: "#fefefe",
                stroke: "#ddd",
                strokeWidth: "1px",
                strokeLinejoin: "round",
            },

            graticule: {
                fill: "none",
                stroke: "#000",
                strokeOpacity: ".7",
                strokeWidth: ".5px",
            }
        };
        countries.map(c => {
            c.path = path(c);
            return c;
        });

        this.baseMap = countries.map((c,i) => {
            return <path key={i} d={c.path} style={style.country}></path>
        });
        this.baseContries = d3.map(countries, function(d) { return d.properties.name; });
    }

    componentDidMount() {
        //this.computeBase();
    }

    moveGroup(e) {
        if(this.state.dragging) {
            if(this.lastMouse) {
                this.position = {
                    x: this.position.x - (this.lastMouse.x - e.clientX),
                    y: this.position.y - (this.lastMouse.y - e.clientY)
                };
            }
            this.lastMouse = {x: e.clientX, y: e.clientY};
            this.forceUpdate();
        }
    }
    
   
    
    render() {
        let {width, height, context, summary, data, highlight, showField, showOverall, type} = this.props;
        //let data = [{title: "test", lat: 10, lng: 10}, {title: "test2", lat: 10, lng: 10}];
        if(!data) {
            return <div>Loading</div>
        }
        if(data.length == 0) {
            return <div>No Data</div>
        }
        
        if(type == "worldMap") {
            return this.render_D3();
        }
        console.log(108);
        let dataJson = data.get("data").toJSON();
        console.log(110);
        dataJson = dataJson.map(item => {
            let info = window.zipInfo.get(item.key);
            if(!info) {
                return undefined;
            }
            item.lat = info.lat;
            item.lng = info.lng;
            return item;
        }).filter(item => item && item.segment > 0);
        
        /*
        var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});
        */
        
        return <Map  zoom={0} style={{height:220}}>
                <TileLayer
                    url='http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
                    maxZoom={16} 
                    attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                />
                <Circle center={[52.51, -0.12]} fillColor='blue' radius={200} />
                <CircleMarker center={[51.51, -0.12]} color='red' radius={20}>
                <Popup>
                    <span>Popup in CircleMarker</span>
                </Popup>
                </CircleMarker>
                
            </Map>
    }
//<FeatureGroup data={dataJson} />
    render_D3() {
        let {width, height, context, summary, data, highlight, showField, showOverall} = this.props;
        if(!data) {
            return <div>Loading</div>
        }
        if(!this.state.dragging) {
            this.lastMouse = undefined;
        }
        let scale = d3.scale.linear().range(["#CAD4DA","#0051A4"]).domain([0, context.max]);

        let dataJson = data.get("data").toJSON();
        showField = showField || "segment";

        return (
            <div>
                <svg width={width} height={height} onMouseLeave={() => this.setState({dragging: false})}>
                    <g onMouseDown={() => this.setState({dragging: true})}
                       onMouseUp={() => this.setState({dragging: false})}
                       onMouseMove={this.moveGroup.bind(this)}
                        transform={"translate(" + this.position.x + "," +this.position.y + ")"}>
                        <rect width={width} height={height} fill="#fff" style={{cursor: "pointer"}}></rect>
                        <g>
                            {this.baseMap}
                            {data.get("data").map(c => {
                                return <path
                                    key={c.get("key")}
                                    d={this.baseContries.get(c.get("key")) ? this.baseContries.get(c.get("key")).path:""}
                                    onMouseEnter={() => this.props.onOver(c.get("key"))}
                                    onMouseLeave={this.props.onOut}
                                    stroke={scale(c.get(showField))} strokeWidth="0.3" fill={scale(c.get(showField))}></path>
                            })}
                        </g>
                    </g>
                    <rect x="5" y="5" width="10" style={{opacity:0.8, cursor: "pointer"}} height="11" fill="white" stroke="#aaa" onClick={e => console.log("WorldMap.js",77, e)}></rect>
                    <text transform="translate(6,15)" style={{fontSize: 12,cursor: "pointer"}} onClick={this.zoomIn.bind(this)}>+</text>

                    <rect x="5" y="17" width="10" style={{opacity:0.8}} height="11" fill="white" stroke="#aaa"></rect>
                    <text transform="translate(7.5,27)" style={{fontSize: 12}} onClick={this.zoomOut.bind(this)}>-</text>
                </svg>
            </div>
        );
    }
}

import { featureGroup } from 'leaflet';

class FeatureGroup extends Path {
  componentWillMount() {
    this.leafletElement = featureGroup();
    let style = {
        marker: {
            fontSize: 10,
            borderRadius: 10    
        }
    }
    let sum = 200;
     let scaleColor = d3.scale.linear()
            .range(["#aaa","#ff0000"]).domain([0,0.5]);
    this.markers = L.markerClusterGroup({
        maxClusterRadius: 1,
        singleMarkerMode: true,
        iconCreateFunction: (cluster) => {
            let countSegmnet = 0;
            let countOverall = 0;
            for (let item of cluster.getAllChildMarkers()) {
                countSegmnet += item.options.data.segment;
                countOverall += item.options.data.count;
            }
            
            return L.divIcon({ html: renderToStaticMarkup(<div 
                style={{
                    fontSize: 10,
                    borderRadius: 100,
                    opacity: 1,
                    backgroundColor: scaleColor(countSegmnet/countOverall),
                    width: Math.sqrt(countSegmnet/sum * 100)+2, 
                    height: Math.sqrt(countSegmnet/sum * 100)+2
                }}></div>)});
        }});
     
  }

  componentDidMount() {
    super.componentDidMount();
    this.setStyle(this.props);
    let {data} = this.props;
    for(let item of data) {
        var marker = L.marker(new L.LatLng(item.lat, item.lng), { data: item });
        marker.bindPopup(item.key);
        this.markers.addLayer(marker);
    }
    this.props.map.addLayer(this.markers);
    this.props.map.fitBounds(this.markers.getBounds());
  }

  componentDidUpdate(prevProps) {
    this.setStyleIfChanged(prevProps, this.props);
  }

  render() {
    return this.renderChildrenWithProps({
      layerGroup: this.leafletElement,
      popupContainer: this.leafletElement,
    });
  }
}



WorldMap.propTypes = {};
WorldMap.defaultProps = {};

export default WorldMap;
/*
{title: "test", lat: 10, lng: 10}*/