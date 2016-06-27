/**
 * Created by cristianfelix on 2/18/16.
 */
import React from 'react';
import d3 from 'd3'
import topojson from 'topojson'
import world from '../../Data/world-topo-min'
import { PropTypes } from 'react';
import L from 'leaflet'
import 'leaflet-fullscreen'
class WorldMap extends React.Component {
    constructor() {
        super();
        this.providers = {
            Satellite: {
                url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                options: {
                    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                }
            },
            withLabels: {
                url: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                options: {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                    subdomains: 'abcd',
                    maxZoom: 19
                }
            },
            noLabels: {
                url: "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
                options: {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                    subdomains: 'abcd',
                    maxZoom: 19
                }
            }
        }
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        console.info("shouldComponentUpdate");
        let should = false;
        if(!this.props) {
            should = true;
        } else if(this.props.data == undefined || nextProps.data == undefined) {
            should = true;
        } else {
            should = 
                nextProps.data.get("data") != this.props.data.get("data") ||
                nextProps.highlight != this.props.highlight
        }
        if(should) {
            this.updateData(nextProps.data)    
            this.updateMap({ props: this.props, state: this.state}, {props: nextProps, state: nextState});
        }
        return false;
    }
    
    componentWillUnmount() {
        console.info("componentWillUnmount");
        this.map = undefined;
    }
    
    
    updateData(data, force) {
        console.info("updateData");
        
        if(!data || !data.get("data")) {
            this.data = undefined;
            console.log("No data");
            return;
        } 
        
        console.log("Cecking update", force, this.props.data == undefined,(this.props.data && data.get("data") != this.props.data.get("data")));
        if(force || this.props.data == undefined || (this.props.data && data.get("data") != this.props.data.get("data"))) {
            let dataJson = data.get("data").take(1000).toJSON();
            dataJson = data.get("data").filter(item => item && (item.get('segment') > 0)).take(1000).toJSON().map(item => {
                let info = window.zipInfo[item.key];
                if(!info) {
                    return undefined;
                }
                item.lat = info.lat;
                item.lng = info.lng;
                return item;
            }).filter(item => item);
            this.data = dataJson;
            console.log("New Data", dataJson);
            this.dataUpdated = true;
        }
        
    }
    
    componentWillMount() {
        console.info("componentWillMount", this.props.data);
        this.updateData(this.props.data)    
    }
    
    updateMap(curent, next) {
        console.info("updateMap");
        let {width, height, context, summary, highlight, showField, showOverall, type, provider} = next.props;
        let data = this.data;
        if(!data) { return <div>Loading</div>}
        if(data.length == 0) { return <div>No Data</div>}
         
        let scale = d3.scale.sqrt().range([1,20]).domain([0, context.max]);
        let scaleColor = d3.scale.linear()
            .range(["#aaa","#FF0004"])
            .domain([0,context.propMax]);
        const position = [41.505, -95.17]; 
        
        if(!this.map) {
            provider = provider ? this.providers[provider] : this.providers.withLabels;
            console.log(provider);
            this.map = L.map(this.refs.mapContainer, { 
                fullscreenControl: {
                    pseudoFullscreen: true 
                }
            }).setView(position, 1);
            L.tileLayer(provider.url, provider.options).addTo(this.map);
        }
        let hasProportion = context.propMax != context.porpMin;
        window.map = this.map;
        
        if(this.dataUpdated) {
            if(this.marks) {
                this.map.removeLayer(this.marks)
            }
            this.marks = L.layerGroup();
            let bounds = {
                latN: -Infinity,
                latS: +Infinity,
                lonW: +Infinity,
                lonE: -Infinity
            }
            data.filter(mark => mark.segment > 0).forEach(mark => {
                let m = L.circleMarker([mark.lat, mark.lng], { 
                    fill:true,  
                    stroke:false, 
                    fillOpacity: hasProportion ? 0.7 : 0.5, 
                    color: hasProportion ? scaleColor(mark.proportion) : "#333", 
                    mouseover: () => {next.props.onOver(mark.key) },
                    mouseout: () => {next.props.onOut},
                    label: mark.key,
                    radius: scale(mark.segment) 
                })
                .on("mouseover", (e) => {next.props.onOver(mark.key, {x: e.originalEvent.clientX, y:e.originalEvent.clientY})})
                .on("mouseout", () => next.props.onOut())
                .addTo(this.marks);
                if(bounds.latN < mark.lat) { bounds.latN = mark.lat }
                if(bounds.latS > mark.lat) { bounds.latS = mark.lat }
                if(bounds.lonE < mark.lng) { bounds.lonE = mark.lng }
                if(bounds.lonW > mark.lng) { bounds.lonW = mark.lng }
                
            });
            console.log(bounds);
             map.fitBounds([
                [bounds.latN, bounds.lonW],
                [bounds.latS, bounds.lonE]
            ]);
            this.marks.addTo(this.map)
            
            this.dataUpdated = false;
        }
    }
    
    componentDidMount() {
       console.info("componentDidMount");
       if(this.props.data) {
           console.info("Has data");
           this.updateData(this.props.data, true);
           this.updateMap(undefined, {props: this.props, state: this.state})
       } else {
           console.info("No data");
       }
    }
    
    componentWillUpdate(nextProps, nextState) {
        console.info("componentWillUpdate");
        this.updateData(nextProps.data);
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.data) {
            console.log("New Props",nextProps.data.toJSON());
        }
    }
    
    
    render() {
        console.info("render");
        return <div ref="mapContainer" style={{height:220}}></div>
    }
}

WorldMap.propTypes = {};
WorldMap.defaultProps = {};

export default WorldMap;

/*
onMouseEnter={() => this.props.onOver(w.get("key"))}
                             onMouseLeave={this.props.onOut} />*/