/**
 * Created by cristianfelix on 1/27/16.
 */
import React from 'react';
import {PRIMARY, PRIMARY_VERY_LIGHT} from './style';

class Word extends React.Component {
    render() {
        let {word, width, height, highlight, barWidth,exclusive, onMouseEnter, onSelect, onMouseLeave,onContextMenu, color, segment, segmentCount } = this.props;
		return (
            <svg width={width}
                 height={height}
                 style={{ margin:0, display: "block", cursor: "pointer"}}
                 onMouseEnter={onMouseEnter}
                 onMouseLeave={onMouseLeave}
                 onContextMenu={onContextMenu}
                 onClick={onSelect}>

                <rect width={barWidth} height={height-1} x="5" fill={PRIMARY_VERY_LIGHT} >
                    <title>{word}</title>
                </rect>

                <text x="10" y={height/2+3} fontSize="14" fill={color}>{word}</text>

                {exclusive && segment.get("label") != "_all" && segmentCount > 1 ? <path d={"M2 5 L5 " + (height/2) +" L2 " + (height - 5)} fill={PRIMARY} /> : undefined}

                {highlight ? <rect y="1" width={width-6} height={height-2} x="5" fill="none" stroke={PRIMARY} >
                </rect> : undefined}
            </svg>
        );
    }
}

Word.propTypes = {};
Word.defaultProps = {};

export default Word;
