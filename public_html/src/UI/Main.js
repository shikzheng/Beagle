/**
 * Created by cristianfelix on 12/30/15.
 */
import React from 'react';
import Container from '../Common/Container';
import Section from './Section';


class Main extends React.Component {
    getStyle() {
        return {
            position: "relative",
            display: "flex",
            alignSelf: "stretch",
            flexGrow: 1,
            height: "100%"
        }
    }
    render() {
        let SummarizeWidth = this.props.width - 350;
        let {dispatch, selectData, segmentData, sumarizeData, api} = this.props;

        let style ={
            mainSection: {
                flexDirection: "column",
                position: "relative",
                display: "flex",
                alignSelf: "stretch",
                flexGrow: 1,
                height: "100%"
            },

            vizSection : {
                position: "relative",
                display: "flex",
                alignSelf: "stretch",
                flexGrow: 1,
                height: "100%"
            },
            
            SelectBar: {
                borderBottom: "solid 1px #ccc",
                height: 34
            }


        };

        return (
          
        );
    }
}

Main.propTypes = {};
Main.defaultProps = {};

export default Main;
