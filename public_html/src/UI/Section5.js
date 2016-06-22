/**
 * Created by cristianfelix on 12/31/15.
 */
import React from 'react';
import Container from '../Common/Container';
var button = require('file!./AddButton.png');
class Section extends React.Component {
    getStyle() {
        return {
            position:"relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            top: this.props.top,
            width: this.props.width,
            borderRight: "solid 1px #ccc"
        }
    }

    render() {
        let {type} = this.props;
        console.log("Section.js",22, type)
        let titleStyle = {
            fontWeight: "bold",
            color:"#8585ad",
            padding: 10,
            fontSize: 30,
            margin: 0
        };
		
		let hrStyle = {
			width: "95%",
			color:this.props.color
        };
		
		let buttonStyle = {
				display:"inline-block",
                position:"Absolute",
                top:"5%",
				left:"75%"
	
        };

        let containerStyle = {
            flexGrow: 1,
            overflow: "auto",
            padding: 5,
            display: "flex"
        };

        let style = this.getStyle();

        if(type == "horizontal") {
            style.flexDirection = undefined
        }


        return (
            <Container style={style}>
                <h1 style={titleStyle}>{this.props.title}</h1>
					<hr style={hrStyle}></hr>
					<span style={buttonStyle} left = "50px">
						<img src={button} width = "40" height = "40" />
					</span>
                <div style={containerStyle}>
                    {this.props.children}
                </div>

            </Container>
        );
    }
}

Section.propTypes = {};
Section.defaultProps = {};

export default Section;
