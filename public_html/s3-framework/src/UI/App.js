/**
 * App.js
 */
import React from 'react';
import Store from '../store';
import {getParameterByName} from './Common/utils';
import {login, loadDocuments} from '../reducers'
import Main from './Main/Main'
//import DocumentsView from './Main/DocumentsView'
import Home from './Home/Home'
import Title from './Title/Title'
import Container from './Common/Container'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {getDefaultSegmentOrder} from '../Data/api';

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
        this.emailTest();


      this.test();
      this.test2();
      this.test3();
      this.test4();
      this.test5();
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
              <Main
                  width={this.state.width}
                  dispatch={this.store.dispatch.bind(this.store)}
                  filterData={storeState.get("filter")}
                  selectData={storeState.get("select")}
                  segmentData={storeState.get("segment")}
                  sumarizeData={storeState.get("summarize")}
                  emailData={storeState.get("documents")}
                  api={storeState.getIn(["app", "api"])} />
              {/* <DocumentsView
              //     dispatch={this.store.dispatch.bind(this.store)}
              //     data={storeState.get("documents")}
              //     api={storeState.getIn(["app", "api"])}
              ///> */}
          </Container>
        )
    }


    emailTest() {
      console.log("test3");
      setTimeout(() => {
          this.store.dispatch(loadDocuments("Enron", "contents", "_all"))
      }, 2000)
    }


    test() {
        let segment = {
            field: "from",
            merge: [],
            exclude: [],
            limit: 300,
            order: getDefaultSegmentOrder("CATEGORICAL")
        };
		console.log("test");
            setTimeout(() => {
            this.store.dispatch({ type: "SET_SEGMENT", segment: segment })
        }, 1000)

    }

    // test3() {
    //     let email = {
    //         field: "date",
    //         merge: [],
    //         exclude: [],
    //         limit: 300,
    //         order: getDefaultSegmentOrder("CATEGORICAL")
    //     };
    // console.log("test");
    //     setTimeout(() => {
    //         this.store.dispatch({ type: "SET_EMAILS", segment: segment })
    //     }, 2000)
    //
    // }

	  getDefaultSummary(type) {
        switch (type) {
            case "QUANTITATIVE": return "barChart";
            case "DATE": return "lineChart";
            case "CONTINUOUS": return "lineChart";
            case "CATEGORICAL": return "barChart";
            case "TEXT": return "wordCloud";
            case "BOOLEAN": return "barChart";
            case "GEO_COUNTRY_NAMES": return "worldMap";
            case "GEO_US_ZIP": return "worldMapLeaf";
        }
    }

	test2() {
		   let summary = {
            field: "subject",
            exclude: [],
            sampleBy: "count",
            show: "count",
            metrics: [],
            type: "TEXT",
            visualization: this.getDefaultSummary("TEXT")
        };
		setTimeout(() => {
        this.store.dispatch({ type: "SAVE_SUMMARY", summary});
		this.store.dispatch({ type: "NEW_SUMMARY_DATA", summary});
		}, 2000)
	}

  test3(){
   let summary = {
          field: "contents",
          exclude: [],
          sampleBy: "count",
          show: "count",
          metrics: [],
          type: "TEXT",
          visualization: this.getDefaultSummary("TEXT")
      };
  setTimeout(() => {
      this.store.dispatch({ type: "SAVE_SUMMARY_CONTENTS", summary});
  }, 2000)
}

  test4(){
   let summary = {
          field: "PERSON",
          exclude: [],
          sampleBy: "count",
          show: "count",
          metrics: [],
          type: "TEXT",
          visualization: this.getDefaultSummary("TEXT")
      };
  setTimeout(() => {
      this.store.dispatch({ type: "SAVE_SUMMARY_PEOPLE", summary});
  }, 2000)
}

  test5(){
   let summary = {
          field: "ORGANIZATION",
          exclude: [],
          sampleBy: "count",
          show: "count",
          metrics: [],
          type: "TEXT",
          visualization: this.getDefaultSummary("TEXT")
      };
  setTimeout(() => {
      this.store.dispatch({ type: "SAVE_SUMMARY_ORGANIZATION", summary});
  }, 2000)
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
