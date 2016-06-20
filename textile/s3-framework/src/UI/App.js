/**
 * Created by cristianfelix on 12/26/15.
 */
import React from 'react';
import Store from '../store';
import {getParameterByName} from './Common/utils';
import {login} from '../reducers'
import Main from './Main/Main'
import DocumentsView from './Main/DocumentsView'
import Home from './Home/Home'
import Title from './Title/Title'
import Container from './Common/Container'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

@DragDropContext(HTML5Backend)
class App extends React.Component {
    constructor() {
        super();
        this.store = new Store();
        this.state = { width: window.innerWidth };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.store.subscribe(() => {
            this.forceUpdate();
            console.info("State Updated", { to :this.store.getState().toJS(), from: this.store.getPrevState().toJS()});
        });
        this.store.dispatch(login(getParameterByName("dataset")));
    }

    handleResize(){
        this.setState({width: window.innerWidth});
    }

    renderHome() {
        return <Home />
    }

    renderWelcome() {
        
    }
    
    renderMain() {
        let storeState = this.store.getState();
        let masterStyle = {
            height: "100%",
            display: "flex",
            flexDirection: "column"
        };

        return (
          <Container style={masterStyle}>
              <Title
                  storeState={this.store.getState()}
                  dispatch={this.store.dispatch.bind(this.store)} />
              <Main
                  width={this.state.width}
                  dispatch={this.store.dispatch.bind(this.store)}
                  selectData={storeState.get("select")}
                  segmentData={storeState.get("segment")}
                  sumarizeData={storeState.get("summarize")}
                  api={storeState.getIn(["app", "api"])} />
              <DocumentsView
                  dispatch={this.store.dispatch.bind(this.store)}
                  data={storeState.get("documents")}
                  api={storeState.getIn(["app", "api"])}/>
          </Container>
        )
    }

    render() {
        let storeState = this.store.getState();
        let status = storeState.getIn(["server", "data", "status"]);
        if (status == "connected") {
            return this.renderMain();
        } else {
            return this.renderHome();
        }
    }
}
export default App;
