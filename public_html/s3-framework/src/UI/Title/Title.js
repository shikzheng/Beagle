/**
 * Created by cristianfelix on 12/30/15.
 */
import React from 'react';
import Container from '../Common/Container'
import Logo from './Logo'
import Tab from './Tab'
import TabList from './TabList'
import TabDetail from './TabDetail'
import {clearAll} from '../../reducers'
import {getParameterByName} from '../Common/utils';
class Title extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedTab: "Fields"
        }
    }

    getStyle() {
        return {
            minHeight: this.state.selectedTab ? 35 : 35,
            backgroundColor: "#074563",
            color: "white",
            overflow: "hidden",
            position: "relative"
        }
    }

    selectTab(tab) {
        if(this.state.selectedTab === tab) {
            this.setState({ selectedTab: undefined});
        } else {
            this.setState({ selectedTab: tab });
        }
    }

    render() {
        let {storeState, dispatch} = this.props;
        let style = this.getStyle();
        let titleHeight = 30;
        let api = storeState.getIn(["app", "api"]);
        let detailList = api.getFieldList().map((d) => {
            return Object.assign({}, d , {type_desc: api.getType(d.key)})
        });
        return (
            <Container style={style}>
                <Logo height={titleHeight} width="200"></Logo>
                {/*<TabList height={titleHeight} left="200">
                    <Tab height={titleHeight} selected={this.state.selectedTab == "Fields"} onClick={() => this.selectTab("Fields")}>Fields</Tab>
                </TabList> */}
                {/*<TabDetail data={detailList} selected={this.state.selectedTab}></TabDetail>*/}
                <div onClick={() => dispatch(clearAll())} style={{position: "absolute", right: 20, top: 8}}><i className="fa fa-trash"/> Clear All</div>
            </Container>
        );
    }
}

Title.propTypes = {};
Title.defaultProps = {};

export default Title;
