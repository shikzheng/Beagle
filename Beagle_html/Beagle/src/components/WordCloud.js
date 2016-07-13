'use strict';

import React from 'react';
import {PRIMARY, PRIMARY_VERY_LIGHT} from './style';
import _ from 'lodash';

require('styles//WordCloud.scss');
require('styles//wordcloud-component-words.scss');
class WordCloud extends React.Component {
  constructor() {
    super();
    this.state = {
      PersonArr: [],
      ContentsArr: [],
      SubjectArr: [],
      OrganizationArr: [],
      PersonMaxCount: 0,
      ContentMaxCount: 0,
      SubjectMaxCount: 0,
      OrganizationMaxCount: 0,
      PersonCount:[],
      ContentCount:[],
      SubjectCount:[],
      OrganizationCount:[]
    }
  }
//<div key={c.Key} className="wordcloud-component-words">{c.Key}</div>
  render() {
  let {words, field} = this.props;

//_.get(words,"0.Count")

  if(field=="PERSON"){
    field = "Person";
    this.state.PersonMaxCount = _.get(words,"0.Count");
    {words.map(c =>
      this.state.PersonArr.push(c.Key)
      )
    }
    {words.map(c =>
      this.state.PersonCount.push(c.Count)
      )
    }

  }

  if(field=="Contents"){
    this.state.ContentMaxCount = _.get(words,"0.Count");
    {words.map(c =>
      this.state.ContentsArr.push(c.Key)
      )
    }
    {words.map(c =>
      this.state.ContentCount.push(c.Count)
      )
    }
  }
  if(field=="Subject"){
    this.state.SubjectMaxCount = _.get(words,"0.Count");
    {words.map(c =>
      this.state.SubjectArr.push(c.Key)
      )
    }
    {words.map(c =>
      this.state.SubjectCount.push(c.Count)
      )
    }
  }
  if(field=="ORGANIZATION"){
    this.state.OrganizationMaxCount = _.get(words,"0.Count");
    field = "Organization";
    {words.map(c =>
      this.state.OrganizationArr.push(c.Key)
      )
    }
    {words.map(c =>
      this.state.OrganizationCount.push(c.Count)
      )
    }
  }
  this.state.PersonArr = this.state.PersonArr.slice(0,20);
  this.state.ContentsArr = this.state.ContentsArr.slice(0,20);
  this.state.SubjectArr = this.state.SubjectArr.slice(0,20);
  this.state.OrganizationArr = this.state.OrganizationArr.slice(0,20);
//              <div idx={idx}  className="goodCSS" >{this.state.PersonArr[idx]}</div>
if(field =="Person"){
    return (
      <table>{field}
      <tr >
      <td className="wordcloud-component">
        {this.state.PersonArr.map((s, idx) =>
          <svg idx={idx} className="goodCSS">
          <g>
          <rect width = "110"  height = "15" x="0" fill={"white"} className="borderCSS" idx={idx} >
        </rect>
          <rect idx={idx}  width = {"110"*((this.state.PersonCount[idx])/(this.state.PersonMaxCount))}  height = "15" x="-6" fill={PRIMARY_VERY_LIGHT} className="goodCSS"   >
        </rect>
        <text x="0" y="10" className = "textCSS">{this.state.PersonArr[idx]}</text>
        </g>
        </svg>
            )
          }
      </td>
      </tr>
      </table>
      );

  }
  if(field =="Contents"){
      return (
        <table>{field}
        <tr >
        <td className="wordcloud-component">
          {this.state.ContentsArr.map((s, idx) =>
            <svg idx={idx} className="goodCSS">
            <g>
            <rect width = "110"  height = "15" x="0" fill={"white"} className="borderCSS" idx={idx} >
          </rect>
            <rect idx={idx}  width = {"110"*((this.state.ContentCount[idx])/(this.state.ContentMaxCount))}  height = "15" x="-6" fill={PRIMARY_VERY_LIGHT} className="goodCSS"   >
          </rect>
          <text x="0" y="10" className = "textCSS">{this.state.ContentsArr[idx]}</text>
          </g>
          </svg>
              )
            }
        </td>
        </tr>
        </table>
      );
    }
    if(field =="Subject"){
        return (
          <table>{field}
          <tr>
          <td className="wordcloud-component">
            {this.state.SubjectArr.map((s, idx) =>
              <svg idx={idx} className="goodCSS">
              <g>
              <rect width = "110"  height = "15" x="0" fill={"white"} className="borderCSS" idx={idx} >
            </rect>
              <rect idx={idx}  width = {"110"*((this.state.SubjectCount[idx])/(this.state.SubjectMaxCount))}  height = "15" x="-6" fill={PRIMARY_VERY_LIGHT} className="goodCSS"   >
            </rect>
            <text x="0" y="10" className = "textCSS">{this.state.SubjectArr[idx]}</text>
            </g>
            </svg>
                )
              }
          </td>
          </tr>
          </table>
        );
      }
      if(field =="Organization"){
          return (
            <table>{field}
            <tr>
            <td className="wordcloud-component">
              {this.state.OrganizationArr.map((s, idx) =>
                <svg idx={idx} className="goodCSS">
                <g>
                <rect width = "110"  height = "15" x="0" fill={"white"} className="borderCSS" idx={idx} >
              </rect>
                <rect idx={idx}  width = {"110"*((this.state.OrganizationCount[idx])/(this.state.OrganizationMaxCount))}  height = "15" x="-6" fill={PRIMARY_VERY_LIGHT} className="goodCSS"   >
              </rect>
              <text x="0" y="10" className = "textCSS">{this.state.OrganizationArr[idx]}</text>
              </g>
              </svg>
                  )
                }
            </td>
            </tr>
            </table>
          );
        }else{
    return(
      <td className="wordcloud-component">{field}
      </td>


        );
  }






  }
}

WordCloud.displayName = 'WordCloud';

// Uncomment properties you need
// WordCloudComponent.propTypes = {};
// WordCloudComponent.defaultProps = {};

export default WordCloud;
