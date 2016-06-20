/**
 * Created by cristianfelix on 1/15/16.
 */
export function  getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export function isDiff (current, next) {
    if(!current && next || current && !next ) {
        return true;
    }
    if(!current && !next) {
        return false;
    }
    let keys = _.union(Object.keys(next), Object.keys(current))
    for (let key of keys) {
        if(current[key] != next[key]){
            return true;
        }
    }
    return false;
}


export function isAnyDiff(current, next, params) {
    if(!current && next || current && !next ) {
        return true;
    }
    if(!current && !next) {
        return false;
    }

    for(let param of params) {
        if(param instanceof Array) {
            let key = param.splice(0,1);
            let path = param;

            if(Immutable.Iterable.isIterable(current[key])) {
                if(current[key].getIn(param) != next[key].getIn(param)) {
                    return true;
                }
            } else if(typeof current[key] == "object") {
                if(_.get(current[key], param) != _.get(next[key], param)){
                    return true
                }
            }
        } else {
            if(current[param] != next[param]){
                return true;
            }
        }
    }
    return false;
}

export function c(...args) {
    let result = {};
    if(args) {
        args.forEach(o => {
            Object.assign(result, o);
        })
    }
    return result;
}