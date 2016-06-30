/**
 * Created by cristianfelix on 12/31/15.
 */
import React from 'react';
import Container from '../Common/Container';

class Emails extends React.Component {
    getStyle() {
        return {
            position:"relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            top: this.props.top,
            width: this.props.width,
            borderRight: "solid 1px #ccc",
            borderBottom: "solid 1px #ccc"
        }
    }



    render() {
        let {type} = this.props;
        console.log("Section.js",22, type)
        let titleStyle = {
            fontWeight: "bold",
            color:"#878A99",
            padding: 3,
            fontSize: 25,
            margin: 0,
        };

		let hrStyle = {
			width: "95%",
			color:this.props.color
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

Emails.propTypes = {};
Emails.defaultProps = {};

export default Emails;