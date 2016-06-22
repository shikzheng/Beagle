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


class Main extends React.Component {
    getStyle() {
        return {
            position: "relative",
            display: "flex",
            alignSelf: "stretch",
            flexGrow: 1,
            height: "100%"
        }
    }
    render() {

        let style ={
            mainSection: {
                flexDirection: "column",
                position: "relative",
                display: "flex",
                alignSelf: "stretch",
                flexGrow: 1,
                height: "100%"
            },

            vizSection : {
                position: "relative",
                display: "flex",
                alignSelf: "stretch",
                flexGrow: 1,
                height: "100%"
            },
            
            SelectBar: {
                borderBottom: "solid 1px #ccc",
                height: 34
            }


        };

        return (
            <Container style={this.getStyle()}>
			
                <Section5 title="Filters" width="18%" left="0" color="#239CDC" >
                </Section5>
				

				<Section3 title="Contacts" width="52%" color="#239CDC"  >
						<Section2 width="35%" color="#55C94B">  					
						</Section2>
						<Section4 width="65%" color="#55C94B">                  
						</Section4>
				</Section3>
				
				
				<Container  style={{display: "block", height:"50%", width:"30%"}}>
					<Section title="Mentions" width="100%" color="#239CDC" >
					</Section>
					<Section title="Emails" width="100%"  color="#239CDC" >
					</Section>
				</Container>

			</Container>
        );
    }
}

Main.propTypes = {};
Main.defaultProps = {};

export default Main;
