
import React from 'react';
import ReactDOM from 'react-dom';
import App from './UI/App';
import Playground from './Data/Playground';
import Study from './UI/Study'
import {getParameterByName} from './UI/Common/utils';
import Analisys from './UI/Analisys'
d3.csv('Data/zips.csv', function(error, result) {
    let map ={};
    for(let zip of result) {
        map[zip.zip] = zip;
    }
    //let map = d3.map(result, function(d) { return d.zip});   
    window.zipInfo = map;
})

if(getParameterByName("study")) {
    let tasks = getParameterByName("tasks")
    ReactDOM.render(<Study tasks={tasks} />, document.getElementById('root'));
} else if (getParameterByName("analisys")) {
    ReactDOM.render(<Analisys />, document.getElementById('root'));
} 
else {
    ReactDOM.render(<App />, document.getElementById('root'));
}

document.onmousemove = function(e){
    window.cursorX = e.pageX;
    window.cursorY = e.pageY;
};

window.onbeforeunload = function(e) {
  return 'You are in the middle of an analisys';
};
