/**
 * Created by cristianfelix on 2/18/16.
 */
import React from 'react';
import d3 from 'd3'
import topojson from 'topojson'
import world from '../../Data/world-topo-min'
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
        this.computeBase();
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

WorldMap.propTypes = {};
WorldMap.defaultProps = {};

export default WorldMap;
