/**
 * Created by cristianfelix on 12/26/15.
 */
import React from 'react';
import Store from '../store';
import {getParameterByName} from './Common/utils';
import {login} from '../reducers'
import Main from './Main/Main'
import DocumentsView from './Main/DocumentsView'
import Home from './Home/Home'
import Title from './Title/Title'
import Container from './Common/Container'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import Task from './Study/Task'
@DragDropContext(HTML5Backend)

class App extends React.Component {
    constructor() {
        super();
        while(!this.userName) {
            this.userName = prompt("Please provide your user idenfier:");
        }
        this.store = new Store();
        this.state = { width: window.innerWidth, task: 0 };
        
        this.traning = [
            {
                label: "Welcome", 
                requireApp: false, 
                title: "Welcome to the training!", 
                message: "Thank you for participating, click in next to start", 
                input: false, 
                likert:false 
            },
            {
                label: "Task 1", 
                requireApp: true, 
                title: "Task 1", 
                message: `Filter reviews to show only restaurants, summarize the ratings, identify the most common rating.`, 
            },
            {
                label: "Task 2", 
                requireApp: true, 
                title: "Task 2", 
                message: `Split the data by city, select “Las Vegas” and “Phoenix” for comparison, summarize review.text and identify the top 3 most relevant words for each.`,  
            },
            {
                label: "Task 3", 
                requireApp: true, 
                title: "Task 3", 
                message: `Which business name has the highest proportion of reviews containing the word “Pizza”, and has at least 500 reviews containing this word.`,  
            },
            {
                label: "Thanks", 
                requireApp: false, 
                title: "Thanks " +  this.userName + "!", 
                message: "This section is finished", 
                input: false, 
                likert:false 
            },
        ]
        
        this.tasks = [
            {
                label: "Welcome", 
                requireApp: false, 
                title: "Welcome " +  this.userName + "!", 
                message: "Thank you for participating, click in next to start", 
                input: false, 
                likert:false 
            },
            {
                label: "Task 1", 
                requireApp: true, 
                title: "Task 1", 
                message: `Filter the data by retrieving only reviews that contain the word “lie” in the field review.text and create a summary using the field business.category. Finally, identify the business category with the highest number of reviews (count).`, 
            },
            {
                label: "Task 2", 
                requireApp: true, 
                title: "Task 2", 
                message: "Split the data using the field named business.category, choose “Hospitals” and “Urgent Care” for comparison. Then create summaries using the field named review.rating. Finally, identify which, between the two categories, has the lowest proportion of 5 stars reviews.",  
            },
              {
                label: "Task 3", 
                requireApp: true, 
                title: "Task 3", 
                message: `Filter the data by retrieving only reviews in which the value of the field business.category is “General Dentistry”, and create a summary using the field review.text. Finally, identify the 4 most frequent words in this category.`,  
            },
            {
                label: "Task 4", 
                requireApp: true, 
                title: "Task 4", 
                message: `Split the data using the field named review.text and create two segments, one using the keyword “worst” and one with the keywords “best”. Create summaries using the field named review.text. Finally, identify for which of the two (“worst” and “best” segments) the word “experience” is more relevant`,  
            },
            //----------------------------
            {
                label: "Task 5", 
                requireApp: true, 
                title: "Task 5", 
                message: `Retrieve reviews for business from "New York" city, and identify which postal code in "New York" city has the highest number of reviews.`,  
            },
            {
                label: "Task 6", 
                requireApp: true, 
                title: "Task 6", 
                message: `Retrieve all reviews containing the word “scam” and identify what are the three top most relevant words that co-occur with “scam”`,  
            },
            {
                label: "Task 7", 
                requireApp: true, 
                title: "Task 7", 
                message: `Compare two data segments, one containing reviews written by male reviewers and one containing those written by female reviewers and identify three words that are unique for male reviewers and three that are unique for female reviewers.`,  
            },
            {
                label: "Task 8", 
                requireApp: true, 
                title: "Task 8", 
                message: `Compare two data segments, one that contains the word "good" and other for "bad". Identify which medical specialty has the highest proportion of reviews in the “good” segment, and which one has the highest proportion in the “bad" segment. Please consider only those medical specialities that have at least 100 reviews containing either word.`,  
            },
            //----------------------------
          
            {
                label: "Task 9", 
                requireApp: true, 
                title: "Task 9", 
                message: `What are the top 3 most relevant words mentioned by female and male reviewers when they give negative (1 star) reviews to a doctor?`,  
            },
            {
                label: "Task 10", 
                requireApp: true, 
                title: "Task 10", 
                message: `Identify one topic (described by at least 3 related words) that reviewers complain about when they give negative (1 star) reviews? Also provide one topic (also described by at least 3 words) they mention when they give positive (5 stars) reviews.`,  
            },
            {
                label: "Task 11", 
                requireApp: true, 
                title: "Task 11", 
                message: `What are the top 3 medical specialties for which the word “scam” is mentioned (proportionally) more often? Please consider only those specialities that have at least 10 reviews containing the word "scam".`,  
            },
            {
                label: "Task 12", 
                requireApp: true, 
                title: "Task 12", 
                message: `For the top 2 cities, i.e., with highest number of reviews, provide the 4 words that are common between the two.`,  
            }, 
            {
                label: "Thanks", 
                requireApp: false, 
                title: "Thanks " +  this.userName + "!", 
                message: "This section is finished, please fill the qualitative feedback form.", 
                input: false, 
                likert:false 
            },
        ]
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize.bind(this));
        localStorage.setItem(this.userName, JSON.stringify({}));
        this.store.subscribe(() => {
            this.forceUpdate();
            console.info("State Updated", { to :this.store.getState().toJS(), from: this.store.getPrevState().toJS()});
        });
        this.store.dispatch(login(getParameterByName("dataset")));
    }

    handleResize(){
        this.setState({width: window.innerWidth});
    }

    renderHome() {
        return <Home />
    }
    next(answers) {
        console.log("Going next");
        let current = JSON.parse(localStorage.getItem(this.userName));
        let currentTask = this[this.selectTasks][this.state.task];
        let currentAnswers = current[currentTask.label] || { label: currentTask.label };
        currentAnswers.completionTime = new Date();
        currentAnswers.answers = answers;
        currentAnswers.state = {
            select: this.store.getState().getIn(["select", "config"]),
            segment: this.store.getState().getIn(["segment", "config"]),
            summarize: this.store.getState().getIn(["summarize", "config"])
        }
        
        current[currentTask.label] = currentAnswers;
        localStorage.setItem(this.userName, JSON.stringify(current))
        
        if(this[this.selectTasks][this.state.task + 1]) {
            let nextTask = this[this.selectTasks][this.state.task + 1];
            let nextAnswers = {
                label: nextTask.label,
                start: new Date()
            }
            current[nextTask.label] = nextAnswers;
            localStorage.setItem(this.userName, JSON.stringify(current))
            this.setState({task: this.state.task + 1});
            this.store.dispatch(login(getParameterByName("dataset")));
        } else {
            alert("Finished")
        }
    }
    renderTask() {
        let storeState = this.store.getState();
        let masterStyle = {
            height: "100%",
            width: this.state.width - 300,
            display: "flex",
            flexDirection: "column"
        };

        return (
            <Task {...this[this.selectTasks][this.state.task]} next={this.next.bind(this)}>
                <Container style={masterStyle}>
                    <Title
                        storeState={this.store.getState()}
                        dispatch={this.store.dispatch.bind(this.store)} />
                    <Main
                        width={this.state.width - 300}
                        dispatch={this.store.dispatch.bind(this.store)}
                        selectData={storeState.get("select")}
                        segmentData={storeState.get("segment")}
                        sumarizeData={storeState.get("summarize")}
                        api={storeState.getIn(["app", "api"])} />
                    <DocumentsView
                        dispatch={this.store.dispatch.bind(this.store)}
                        data={storeState.get("documents")}
                        api={storeState.getIn(["app", "api"])}/>
                </Container>
            </Task>
        )
    }

    renderMain() {
        let storeState = this.store.getState();
        let masterStyle = {
            height: "100%",
            display: "flex",
            flexDirection: "column"
        };

        return (
          <Container style={masterStyle}>
              <Title
                  storeState={this.store.getState()}
                  dispatch={this.store.dispatch.bind(this.store)} />
              <Main
                  width={this.state.width}
                  dispatch={this.store.dispatch.bind(this.store)}
                  selectData={storeState.get("select")}
                  segmentData={storeState.get("segment")}
                  sumarizeData={storeState.get("summarize")}
                  api={storeState.getIn(["app", "api"])} />
              <DocumentsView
                  dispatch={this.store.dispatch.bind(this.store)}
                  data={storeState.get("documents")}
                  api={storeState.getIn(["app", "api"])}/>
          </Container>
        )
    }

    
    componentWillMount() {
        this.selectTasks = this.props.tasks;
    }
    
    render() {
        let storeState = this.store.getState();
        let status = storeState.getIn(["server", "data", "status"]);
        return this.renderTask();
    }
}
export default App;
