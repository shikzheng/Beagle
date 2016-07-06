var React = require('react')

var TextBox = React.createClass({
  getInitialState: function(){
    return {
      hover: false,
      focus: false
    }
  },

  toggleHover: function() {
    this.setState(
      {hover: !this.state.hover})
  },

  toggleFocus: function() {
    this.setState(
      {focus: !this.state.Focus})
  },

  render: function() {
    var textStyle
    if (!this.state.hover) {
      textStyle =  {
        width: 160,
        marginLeft: 20,
        marginTop: 5,
        border: 0,
        outline: 0,
        backgroundColor: "white",

      }
    } else {
      textStyle =  {
        width: 160,
        marginLeft: 20,
        marginTop: 5,
    }
  }

    return(
        <input style={textStyle} onMouseEnter={this.toggleHover} onMouseLeave= {this.toggleHover} type="text"/>
    )
  }
})

module.exports = TextBox
