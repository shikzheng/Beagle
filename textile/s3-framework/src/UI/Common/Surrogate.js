/**
 * Created by cristianfelix on 1/4/16.
 */
import React from 'react';
import Container from '../Common/Container'

export default class Surrogate extends React.Component {
    getHtml(text) {
        text = text.replace(/<em>/g, '<em style="font-weight:bold">');
        return {__html: text};
    };

    getStyle() {
        return {
            fontSize: 11,
            borderBottom: "solid 1px #ccc",
            padding: 5
        }
    }

    render() {
        let {data, onSelect} = this.props;
        let {showDetails} = this.props;
        return (
            <Container style={this.getStyle()} onClick={onSelect}>
                {data.get("highlight").map((html, i) => {
                    return (<div style={{marginBottom: 5}} key={i} dangerouslySetInnerHTML={this.getHtml(html)}></div>)
                })}
            </Container>
        );
    }
}
