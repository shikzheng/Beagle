/**
 * Created by cristianfelix on 12/30/15.
 */
import React from 'react';
import Container from '../Common/Container';
import Field from './Field'


class TabDetail extends React.Component {
    getStyle() {
        return {
            backgroundColor: "white",
            color: "black",
            marginTop: 30,
            marginLeft: -10,
            marginRight: -10,
            //boxShadow: "inset 0px -1px 10px #ddd",
            borderTop: "solid 10px #2B759B",
            paddingTop: this.props.selected ? 10 : 0,
            paddingBottom: this.props.selected ? 10 : 0,
            paddingLeft: 20,
            paddingRight: 20,
            display: this.props.selected ? "block" : "block",
            maxHeight: this.props.selected ? 65 : 0,
            overflow: "auto"
        }
    }

    render() {
        let {data} = this.props;
        let fields = data;
        let datasets = [
            {key: "Yelp Health", icon: "number"},
            {key: "WHS", icon: "number"}
        ];
        let items = [];
        if(this.props.selected == "Fields"){
            items = fields.map((field) => <Field key={field.key} data={field} />);
        } else if (this.props.selected == "Datasets") {
            items = datasets.map((field) => <Field key={field.key} data={field} />);
        }
        return (
            <Container style={this.getStyle()}>{items}</Container>
        );
    }
}

TabDetail.propTypes = {};
TabDetail.defaultProps = {};

export default TabDetail;
