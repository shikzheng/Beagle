/**
 * Created by cristianfelix on 1/15/16.
 */
import React from 'react';

class Home extends React.Component {
    style() {
        return {
            container:
            {
                textAlign: "center"
            }
        }
    }

    render() {
        let style = this.style();
        return (
            <div style={style.container}>
                <h1>TextTile</h1>
                <h2>Loading...</h2>
            </div>
        );
    }
}

Home.propTypes = {};
Home.defaultProps = {};

export default Home;
