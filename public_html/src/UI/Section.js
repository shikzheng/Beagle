/**
 * Created by cristianfelix on 12/31/15.
 */
import React from 'react';
import Container from './Container';

class Section extends React.Component {
    getStyle() {
        return {
            position:"relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            top: 0,
            width: this.props.width,
            borderRight: "solid 1px #ccc"
        }
    }

    render() {
        let {type} = this.props;
        console.log("Section.js",22, type)
        let titleStyle = {
            fontWeight: "normal",
            color:this.props.color,
            padding: 5,
            fontSize: 20,
            margin: 0,
            borderBottom: "solid 1px #ccc"
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
