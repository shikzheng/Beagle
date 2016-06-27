/**
 * Created by cristianfelix on 1/27/16.
 */
import React from 'react';
import {PRIMARY} from '../Summaries/style'
class Dialog extends React.Component {
    render() {
        let {title, buttons} = this.props;

        let style = {
            backgroundColor: "white",
            display: "inline-block",
            marginTop: 80,
            boxShadow: "0px 0px 10px #000"
        };
        let backdropStyle = {
            textAlign: "center",
            position: "fixed",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "rgba(100,100,100,0.5)"
        };

        let styleTitle = {
            border: "solid 1px #bbb",
            boxShadow: "0px 2px 2px #ccc",
            padding: 10,
            color: PRIMARY,
            marginBottom: 5,
            fontWeight: "bold"
        };

        let styleButtons = {
            borderTop: "solid 1px #ccc",
            marginTop: 5,
            boxShadow: "0px -2px 2px #ccc",
            padding: 10,
            textAlign: "right"
        };

        let primaryStyle = {
            backgroundColor: "white",
            border: "solid 1px " + PRIMARY,
            color: PRIMARY
        }

        let buttonStyle = {
            backgroundColor: "white",
            border: "none",
            color: "#999",
            textDecoration: "underline"
        }

        return (
            <div style={backdropStyle}>
                <div style={style}>
                    <div style={styleTitle}>{title}</div>
                    <div>
                        {this.props.children}
                    </div>
                    <div style={styleButtons}>
                        {buttons.map(b => <button key={b.title} style={b.primary ? primaryStyle : buttonStyle} onClick={b.action}>{b.title}</button>)}
                    </div>
                </div>
            </div>
        );
    }
}

Dialog.propTypes = {};
Dialog.defaultProps = {};

export default Dialog;
