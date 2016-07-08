import React, {Component} from 'react';

class Task extends Component {
    constructor() {
        super();
        this.state = {
            small: false,
            answered: false
        }
    }
    answer() {
        console.log("answer");
        
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.title != this.props.title) {
            this.setState({
                small: false,
                answered: false,
                likert: "",
                answer: ""
            })
        }
    }
    
    next () {
        let  {requireApp} = this.props;
        if(requireApp) {
            if(this.state.answered) {
                console.log("answered");
                if(!this.state.likert || this.state.likert.length == 0) {
                    alert("Please fill the answer")
                } else {
                    this.props.next({
                        response: this.state.answer,
                        likert: this.state.likert
                    })
                }
            } else {
                console.log("not answered");
                if(!this.state.answer || this.state.answer.length == 0) {
                    alert("Please fill the answer")
                } else {
                    this.setState({
                        answered: true
                    })
                }
            }
        } else {
            this.props.next();
        }
    }
    renderBig() {
        //{label: "Welcome", requireApp: false, title: "Welcome!", message: "Thank you for participating, click in next to statrt", input: false, likert:false }
        let {title, message, next, requireApp} = this.props;
        let style = {
            container: {
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "white"
            },
            window: {
                position: "absolute",
                textAlign: "center",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -70%)",
                backgroundColor: "white",
            },
            windowSmall: {
                position: "absolute",
                textAlign: "center",
                paddingTop: 20,
                top: 0,
                right: 0,
                width: 300,
                bottom: 0,
                transition: "all 0.5s",
                boxShadow: "0px 0px 10px #ccc",
                backgroundColor: "white",
                zIndex: 2000   
            },
            title: {
                fontSize: 25,
                marginBottom: 20
            },
            controls: {
                marginTop: 10    
            },
            message: {
                marginBottom: 20,
                textAlign: "left",
                padding: 10
            },
            button: {
                fontSize: 14,
                border: "none",
                backgroundColor: "#074563",
                color: "white"
            },
            textarea: {
                height: 100,
                width: "95%"
            },
            answer: {
                display: requireApp && !this.state.answered ? "block" : "none"
            },
            scale: {
                borderTop: "solid 1px #ccc",
                display: requireApp && this.state.answered ? "block" : "none",
                padding: 5
            }
        }
        return (
            <div style={style.container}>
                <div style={requireApp ? style.windowSmall : style.window}>
                    <div style={style.title}>{title}</div>
                    <div style={style.message}>{message}</div>
                    <div style={style.answer}>
                        <div style={{textAlign: "left"}}>Answer</div>
                         <textarea 
                            style={style.textarea}
                            ref="answer" 
                            value={this.state.answer} 
                            onChange={(e) => this.setState({answer: e.target.value})} />
                    </div>
                    <div style={style.scale}>
                        <div>
                            On a scale of 1 to 5, how easy was this task?
                        </div>
                        <div>
                            <select 
                                value={this.state.likert}
                                onChange={(e) => this.setState({likert: e.target.value})} >
                                <option value=""></option>
                                <option value="1">Very Easy</option>
                                <option value="2">Easy</option>
                                <option value="3">Medium</option>
                                <option value="4">Hard</option>
                                <option value="5">Very Hard</option>
                            </select>
                        </div>
                    </div>
                    <div style={style.controls}>
                        <button 
                            style={style.button} 
                            onClick={this.next.bind(this)}>Next</button>
                    </div>
                </div>
                {requireApp ? this.props.children : undefined}
            </div>
        );
    }
    
    renderSmall() {
        
    }
    
    render() {
        if(this.state.small) {
            return this.renderSmall;
        } else {
            return this.renderBig();
        }
        
    }
}

export default  Task;