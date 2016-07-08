/**
 * Created by cristianfelix on 12/26/15.
 */
import elasticsearch from 'elasticsearch';
import _ from 'lodash';
import Immutable from 'immutable'
import {stopWords} from './config/stopWords';
import {newSelectData, newSegmentData, newSummaryData,newDocumentsData} from './reducers'

export default class API {

    constructor() {}

    getSegmentFilter() {}
    //Load Summary Data
    //Load Select Data
    //Load Documents
    //Load Related

    //**Filters Levels
    //Documents Satisfying the Select
    //Documents Satisfying the Select and a Segment
    //Documents Satisfying the Select and a Segment and a Summary Key
    //Documents Satisfying the Select and a Summary Key

    //**Config
    //Get Field List
    //Get Field Type
    //Get Defaults for File type

    //**Calls
    //Compile
    //Execute
}


export class Compiler {
    constructor(schema) {}
    //Select
    getSelectFilter(){}
    getSelectAggregation(){}

    //Segment
    getSegmentFilter(){}
    getSegmentAggregation(){}

    //Summary
    getSummaryFilter(){}
    getSummaryAggregation(){}

    compile(query, goal) {

    }

}


































