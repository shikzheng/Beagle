import React, {Component} from 'react';
import moment from 'moment'

class Analisys extends Component {
    render() {
        let users = ["cs_1", "CS_2", "CS_2b", "cs_03", "cs_04", "cs_04b", "cs_05", "cs_05b","cs_06", "ap_01", "AP_02B","AP_02", "AP_03","AP_04","AP_05", "AP_16"]
        let tasks = ["Task 1","Task 2","Task 3","Task 4","Task 5","Task 6","Task 7","Task 8","Task 9","Task 10","Task 11","Task 12"]
        let results = {}
        let style = {
            table: {
                borderCollapse: "collapse",
                border: "1px solid black"
            },
            th: {
                border: "1px solid black"
            },
            td: {
                border: "1px solid black"
            },
            task: {
                marginBottom: 20
            }
        }
        for(let user of users) {
            results[user] = JSON.parse(localStorage.getItem(user))
        }
        let LikertScale = {
            1:5,
            2:4,    
            3:3,
            4:2,
            5:1
        }
        
        return (
            <div>
                {tasks.map(task => {
                    return <div key={task} style={style.task}>
                        <h1>{task}</h1>
                        <table  style={style.table}>
                            <thead>
                                <tr style={style.tr}>
                                    <td style={style.td}>User</td>
                                    <td style={style.td}>Time</td>
                                    <td style={style.td}>Answer</td>
                                    <td style={style.td}>How Easy</td>
                                    <td style={style.td}>Select</td>
                                    <td style={style.td}>Split by</td>
                                    <td style={style.td}>Comparing</td>
                                    <td style={style.td}>Summarize by</td>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => {
                                    let info = results[user][task];
                                    let state = info && info.state;
                                    
                                    return info && 
                                        info.answers && 
                                        info.answers.response != "Disconsider" && 
                                        info.answers.response != "Desconsider" ? <tr key={user} style={style.tr}>
                                        <td  style={style.td}>{user}</td>
                                        <td  style={style.td}>{
                                            moment([2010, 1, 1, 0, (moment(info.completionTime).diff(info.start, "minutes")), (moment(info.completionTime).diff(info.start, "seconds")) % 60]).format("mm:ss")
                                        }</td>
                                        <td  style={style.td}>{info.answers.response}</td>
                                        <td  style={style.td}>{LikertScale[info.answers.likert]}</td>
                                        <td  style={style.td}>{info.state.select.rules.map(r => r.field + " = " + r.value).join(",")}</td>
                                        <td  style={style.td}>{info.state.segment.field}</td>
                                        <td  style={style.td}>{info.state.segment.selectedKeys && results[user][task].state.segment.selectedKeys.join(",")}</td>
                                        <td  style={style.td}>{JSON.stringify(state.summarize && state.summarize.summaries.map(s => s.field).join(","))}</td>
                                    </tr> : undefined
                                })}
                            </tbody>
                        </table>   
                    </div> 
                })}
            </div>
        );  
    }
}

export default Analisys;
