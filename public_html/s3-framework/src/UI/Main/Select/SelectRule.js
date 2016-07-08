/**
 * Created by cristianfelix on 12/31/15.
 */
import React from 'react';
import Container from '../../Common/Container'

class SelectRule extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    getStyle() {
        return {
            marginBottom: 5,
            backgroundColor: "#f0f0f0",
            fontSize: 12,
            padding: 3,
            borderRadius: 5,
            position: "relative",
            cursor: "pointer",
            marginRight: 10,
            paddingRight: 10,
            paddingLeft: 10,
            overflow: "auto",
            overflowY: "hidden",
            height: 28,
            display: "inline-block"
        }
    }

    renderValues() {
        let {data} = this.props;
        let innerText = "";
        switch(data.get("op")) {
            case "between":
                innerText = data.get("value").join(" to ");
                break;
            case "in":
                innerText = "(" + data.get("value").join(", ") + ")";
                break;
            case "contains":
                innerText = data.get("value");
                break;
            case "is":
                innerText = data.get("value");
                break;
        }
        return (<span style={{fontWeight: "bold"}}>{innerText}</span>)
    }
    renderField() {
        let {data} = this.props;
        return (<span>{data.get("field")}</span>)
    }

    renderOperation() {
        let {data} = this.props;
        return  (<span style={{color: "#999"}}></span>);
    }

    render() {
        let {data} = this.props;
        let buttonProps = {
            className: "fa fa-trash-o",
            onClick: () => this.props.onRemoveClick(data.get("field")),
            style: {
                display: this.state.hover ? "block" : "none",
                position: "absolute",
                right: 5,
                top: 3
            }
        };
        return (
            <Container style={this.getStyle()}
                       onMouseOver={() => {this.setState({hover: true})}}
                       onMouseOut={() => this.setState({hover: false})}>
                <div>{this.renderField()} {this.renderOperation()}</div>
                <div>{this.renderValues()}</div>
                <i {...buttonProps} />
            </Container>
        );
    }
}
/*{ //Fetches data in a range
    type: "quantitative",
        field: "field",
    op: "between",
    values:[1, 10]
}*/

SelectRule.propTypes = {};
SelectRule.defaultProps = {};

export default SelectRule;
