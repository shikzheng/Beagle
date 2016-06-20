/**
 * Created by cristianfelix on 1/27/16.
 */
import React from 'react';
import Dialog from '../Common/Dialog'
import Surrogate from '../Common/Surrogate';
import {clearDocuments} from '../../reducers';
class DocumentsView extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        let {dispatch, data, api} = this.props;
        let {selected} = this.state;
        if(data.get("data").size == 0) { return <div></div>}

        let buttons = [{
            title: "Close",
            action: () => { dispatch(clearDocuments())},
            primary: true
        }];

        let buttons2 = [{
            title: "Close",
            action: () => { this.setState({selected: undefined })},
            primary: true
        }];

        let fieldList = api.getFieldList();

        if(selected) {

            return (<Dialog title="Details" buttons={buttons2}>
                <div style={{maxWidth: 900, fontSize: 12, maxHeight: 500, overflow: "auto", padding: 10}}>
                <table style={{textAlign: "left", width: 400}}>
                    {fieldList.map( f => {
                        console.log("DocumentsView.js",31, f);
                        return(<tr>
                            <td style={{borderBottom: "solid 1px #ccc"}}>{f.key}</td>
                            <td style={{borderBottom: "solid 1px #ccc"}}>{selected.getIn(f.key.split(".")) && selected.getIn(f.key.split(".")).join ? selected.getIn(f.key.split(".")).join(", ") : selected.getIn(f.key.split("."))}</td>
                        </tr>)})}
                </table>
                </div>
            </Dialog>)
        }

        console.log("DocumentsView.js",48, data.get("data").get("documents"))

        return (
            <Dialog title="Documents" buttons={buttons}>
                <div style={{maxWidth: 300, maxHeight: 500, overflow: "auto", padding: 10, textAlign: "left"}}>
                    { data.get("data").get("documents").map((doc, i) => <Surrogate onSelect={() => this.setState({selected: doc})} key={doc.get("_id")} data={doc} />)}
                </div>
            </Dialog>
        );
    }
}

DocumentsView.propTypes = {};
DocumentsView.defaultProps = {};

export default DocumentsView;
