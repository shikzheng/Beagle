/**
 * Created by cristianfelix on 2/3/16.
 */
import React from 'react';
import {render} from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import {} from './DefaultState'

import 'brace/mode/json';
import 'brace/theme/github';
import "brace/ext/language_tools";

const ACTIONS = [
    {
        action: "select",
        desc: "Filter the data by specific rules",
        snippet: {rules: [{field: "$1", op: "$2", value: "$3"}]}
    },
    {
        action: "rule",
        desc: "New Rule",
        noCaption: true,
        snippet: {field: "$1", op: "$2", value: "$3"}
    },
    {
        action: "segmentText", key: "segment", snippet: { field: "$1", selectedKeys: ["$2"]}
    },
    {action: "segment", desc: 'Segment the data in buckets to allow for comparison'},
    {action: "summarize", desc: "Show the distribution of the field given a segment and a selection"}
];

const OPERATIONS = [
    {op: "in"},
    {op: "contains"},
    {op: "between"},
    {op: "is"}
];


class Editor extends React.Component {
    getType(session, pos) {
        let tokens = session.getTokens(pos.row);
        let variable = tokens.find(v => v.type == "variable")
        if(variable) {
            return variable.value;
        }
        return variable;
    }

    getObj(session, pos) {
        let path = [];
        let obj = undefined;
        for(var r = pos.row; r >= 0; r--){
            let variable = session.getTokens(r).find(t=> t.type  == "variable")
            if(variable) {
                try {
                    obj = JSON.parse(session.getValue());
                } catch (e) {

                }
                path.unshift(variable.value.substr(1, variable.value.length-2));
            }
        }
    }

    render() {
        let self = this;
        let {value, fields, height} = this.props;
        return (
            <AceEditor
                height="720"
                mode="json"
                value={JSON.stringify(value, null, 4)}
                theme="github"
                onChange={this.props.onChange}
                onBeforeLoad={(ace) => {
                    if(self.props.readOnly) return;
                    let editor = ace.edit("editor");
                    let langTools = ace.acequire("ace/ext/language_tools");

                    editor.commands.addCommand({
                        name: 'run',
                        bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
                        exec: function(editor, s, x) {
                            let value = undefined;
                            try {
                                value = JSON.parse(editor.session.getValue())

                            } catch (e) {
                                console.trace("Editor.js",86, e);
                                alert("Invalid Syntax")
                            }
                            if(value) {
                                self.props.run(value);
                            }
                        },
                        readOnly: true
                    });


                    editor.$blockScrolling = Infinity;
                    editor.setOptions({
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true
                    });
                    let rhymeCompleter = {
                        getCompletions: function(editor, session, pos, prefix, callback) {
                            let type = self.getType(session, pos);
                            let list = ACTIONS.map(function(s) {
                                return {
                                    caption: s.action,
                                    snippet: s.noCaption ?  JSON.stringify(s.snippet, null, 4) + "$9" :  '"' + (s.key || s.action) + '"' + ":" + JSON.stringify(s.snippet, null, 4) + "$9",
                                    meta: "action",
                                    score: Number.MAX_VALUE,
                                    docHTML: s.desc
                                }
                            });
                            self.getObj(session, pos);
                            switch (type) {
                                case '"field"':
                                    list = fields.map(function(s) {
                                        return {
                                            caption: s.field,
                                            snippet: s.field,
                                            meta: s.type,
                                            score: Number.MAX_VALUE
                                        }
                                    });
                                    break;
                                case '"op"':
                                    list = OPERATIONS.map(function(s) {
                                        return {
                                            caption: s.op,
                                            snippet: s.op,
                                            meta: "operation",
                                            score: Number.MAX_VALUE
                                        }
                                    });
                                    break;
                            }

                            //Actions
                            callback(null, list);
                        }
                    };
                    langTools.addCompleter(rhymeCompleter);
                }}
                name={this.props.id || "editor"}
                editorProps={{$blockScrolling: Infinity}}
            />
        );
    };
}

Editor.propTypes = {};
Editor.defaultProps = {};

export default Editor;
