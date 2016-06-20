/**
 * Created by cristianfelix on 12/30/15.
 */
import React from 'react';
import Container from '../Common/Container';
import Section from './Section';
import Select from './Select/Select';
import Segment from './Segment/Segment';
import Summarize from './Summarize/Summarize';
import FieldList from './FieldList';


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
        let SummarizeWidth = this.props.width - 350;
        let {dispatch, selectData, segmentData, sumarizeData, api} = this.props;

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
                <Section title="Fields" width="200" left="0" color="#CCC">
                    <FieldList  dispatch={dispatch} api={api} />
                </Section>
                <Container style={style.mainSection}>
                    <Container style={style.SelectBar}>
                        <Select color="#E0376D" data={selectData} dispatch={dispatch} api={api} />
                    </Container>
                    <Container style={{display: "flex", height: window.innerHeight - 30}}>
                        <Section title="Split" width="150" left="200" color="#239CDC">
                            {<Segment data={segmentData} dispatch={dispatch} api={api} />}
                        </Section>
                         <Section title="Summarize" width={SummarizeWidth} left="400" color="#55C94B">
                             {<Summarize data={sumarizeData} segmentData={segmentData} dispatch={dispatch} api={api} />}
                        </Section>
                    </Container>
                </Container>
            </Container>
        );
    }
}

Main.propTypes = {};
Main.defaultProps = {};

export default Main;
