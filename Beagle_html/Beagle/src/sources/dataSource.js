import ESPlugin from '../../lib/suQL/src/plugins/elasticsearch/'
const dataInfo = require('./enron.json')
import suQL from '../../lib/suQL/src/index';
console.log(dataInfo);
let executor = new suQL(dataInfo.mapping, new ESPlugin(dataInfo.config));

export default executor