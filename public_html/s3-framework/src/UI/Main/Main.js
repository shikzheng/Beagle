/**
 * Created by cristianfelix on 12/30/15.
 */
import React from 'react';
import Container from '../Common/Container';
import Section from './Section';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section5 from './Section5';
import Emails from './Emails';
import Select from './Select/Select';
import Segment from './Segment/Segment';
import Summarize from './Summarize/Summarize';
import FieldList from './FieldList';
import Email from './EmailTable/Email'
var Filter = require('./Filter/Filter.js');

class Main extends React.Component {
    getStyle() {
        return {
            position: "relative",
            display: "flex",
            alignSelf: "stretch",
            flexGrow: 1,
            height: "100%",
			zoom: "100%",
        }
    }
    render() {
		let {dispatch, filterData,emailData, selectData, segmentData, sumarizeData, api} = this.props;
        let style ={
            mainSection: {
                flexDirection: "column",
                position: "relative",
                display: "flex",
                alignSelf: "stretch",
                flexGrow: 1,
                height: "100%"
            }
        };

        //console.log("Emaildata: " + emailData);

        return (
            <Container style={this.getStyle()}>
                <Section5 dispatch={dispatch} title="Filters" width="17.9%" left="0" color="#239CDC" >
                <Filter data={filterData} />
                </Section5>
        				<Section3 title="Contacts" width="52%" color="#239CDC"  >
        						<Section2 width="35%" color="#55C94B">
        						{<Segment data={segmentData} dispatch={dispatch} api={api} />}
        						</Section2>
        						<Section4 width="65%" color="#55C94B">
        						</Section4>
        				</Section3>
        				<Container  style={{display: "block", height:"51%", width:"30%"}}>
        					<Section title="Mentions" width="100%" color="#239CDC" >
								<Summarize data={sumarizeData} segmentData={segmentData} dispatch={dispatch} api={api} />
        					</Section>
        					<Emails title="Emails" width="100%"  color="#239CDC">
								<Email data={emailData} dispatch={dispatch} api={api} />
        					</Emails>
        				</Container>

      			</Container>
        );
    }
}

Main.propTypes = {};
Main.defaultProps = {};

export default Main;
