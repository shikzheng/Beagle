/**
 * Created by cristianfelix on 12/26/15.
 */
import React from 'react';
import Main from '../containers/Main'
import Container from '../containers/Container'

class App extends React.Component {

    handleResize(){
        this.setState({width: window.innerWidth});
    }


    render() {

	let masterStyle = {
	    height: "100%",
	    display: "flex",
	    flexDirection: "column"
        };

        return (
	<div>
          <Container style={masterStyle}>
              <Main />
          </Container>
	</div>

        )
    }
}
export default App;
