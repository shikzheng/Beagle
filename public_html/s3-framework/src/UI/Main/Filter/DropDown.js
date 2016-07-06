var React = require('react')
var lodashMap = require('lodash.map')
var TextBox = require('./TextBox.js')

var DropDown = React.createClass({

  propTypes: {
    options: React.PropTypes.any.isRequired,
    active: React.PropTypes.any.isRequired,
    onChange: React.PropTypes.func.isRequired,
    className: React.PropTypes.string
  },

  handleChange (event) {
    this.props.onChange(event, event.target.value, this.props.options[event.target.value])
  },

  getInitialState: function(){
    return {
      numText: [1],
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

  onClick: function() {
    var newElement = 1;
    this.setState({focus: !this.state.focus});
    this.setState({
    numText: this.state.numText.concat([newElement])
})
  },


  render () {
    let dropStyle = {
      border: 0,
      outline: 0,
      backgroundColor: "white",
      display: "inline-block"
    }

    var buttonStyle

    var {options, active, className} = this.props

    if (!this.state.hover) {
      buttonStyle =  {
        marginTop: 1,
        border: 0,
        outline: 0,
        backgroundColor: "white",
        color: "white"
      }
    } else {
      buttonStyle = {
        marginTop: 1,
      }
    }

    if(this.state.focus) {
      buttonStyle = {
        marginTop: 1
      }
    }


    console.log("Focus: " + this.state.focus)
    console.log(this.state.numText)

    return (
      <span style={dropStyle} >
      {options[active]}

      <select style={dropStyle} onChange={this.handleChange} value={active}>
        {lodashMap(options, function mapOptions (value, key) {
          return (
            <option value={key} key={key}>{value}</option>
          )
        })}
        </select>

        {this.state.numText.map((s, idx) => {
            return (
            <span>
            <TextBox />
            <span>
            <button style={buttonStyle} onMouseEnter={this.toggleHover} onMouseLeave= {this.toggleHover} type="button"
            onClick={this.onClick}>OR</button>
            </span>
            </span>)
        })}







      </span>
    )
  }
})

module.exports = DropDown
