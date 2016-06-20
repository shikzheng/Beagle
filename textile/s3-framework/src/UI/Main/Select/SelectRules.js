/**
 * Created by cristianfelix on 12/31/15.
 */
import React from 'react';
import Container from '../../Common/Container'
import SelectRule from './SelectRule'
import Caption from './Caption'
import { DropTarget } from 'react-dnd';
import {ItemTypes} from '../../../definitions';

const selectRulesTarget = {
    drop(props,monitor) {
        const item = monitor.getItem();
        props.addRule(item);
        return { name: 'SelectRules' };
    }
};

@DropTarget([ItemTypes.FIELD], selectRulesTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))
export default class SelectRules extends React.Component {
    getStyle() {
        const { canDrop, isOver, connectDropTarget } = this.props;
        return {
            marginBottom: 0,
            marginTop: 0,
            height: 20
        }
    }

    render() {
        let {data} = this.props;
        const { canDrop, isOver, connectDropTarget } = this.props;
        let background = canDrop ? "linear-gradient(#cdf, #def)" : (isOver ? "linear-gradient(#000, #cdf)" : "linear-gradient(#eee, #fAfAfA)");
        return connectDropTarget(
            <div style={this.getStyle()}>
                {data.map((rule, i) => <SelectRule key={i} data={rule} onRemoveClick={this.props.onRemove} />)}
            </div>
        );
    }
}
/*<Container style={{marginLeft: 0, background: background, textAlign: "center"}}>+</Container>*/