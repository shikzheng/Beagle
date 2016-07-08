var React = require('react')

var TextBox = React.createClass({
  getInitialState: function(){
    return {
      buttonFocus: false,
      textFocus: false
    }
  },


  toggleHover: function() {
    this.setState(
      {hover: !this.state.hover})
  },

  toggleFocus: function() {
    this.setState(
      {focus: !this.state.focus})
  },

  onClick: function() {
    let {data} = this.props;
    var newElement = 1;
    this.setState({focus: true});
    data.push(newElement);
    this.props.func(data);
  },

  textClick: function() {
    this.setState({textFocus: true});
  },


  render: function() {
    var textStyle
    var buttonStyle
    if (!this.state.textFocus) {
      textStyle = {
        width: 160,
        marginLeft: 20,
        marginTop: 5,
        opacity: 0.5
      }
    } else {
      textStyle =  {
        width: 160,
        marginLeft: 20,
        marginTop: 5,
        border: 0,
        outline: 0,
        backgroundColor: "white",
      }
    }

    if(this.state.focus) {
      buttonStyle = {
        marginTop: 1,
        border: 0,
        outline: 0,
        visibility:"hidden"
      }
    } else {
      buttonStyle = {
        marginTop: 1,
        opacity: 0.5
      }
    }

    return(
        <span>
        <span>
        <input style={textStyle} onMouseEnter={this.toggleHover} onMouseLeave= {this.toggleHover} type="text"
        onClick={this.textClick}/>
        </span>
        <span>
        <button style={buttonStyle} onMouseEnter={this.toggleHover} onMouseLeave= {this.toggleHover} type="button"
        onClick={this.onClick}>OR</button>
        </span>
        </span>
    )
  }
})

module.exports = TextBox
