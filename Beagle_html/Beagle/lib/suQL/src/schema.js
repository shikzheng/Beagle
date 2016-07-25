const {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
} = require('graphql');


const b =
function (mapping, schemaLoader) {
    return Promise.resolve(schemaLoader).then(info => {
        const {resolvers} = info;
        const RuleType = require('./types/RuleType')
        const SelectType = require('./types/SelectType')(mapping, resolvers);
        return new GraphQLSchema({
            query: new GraphQLObjectType({
                name: 'TextTile',
                fields: {
                    check: {
                        type: GraphQLBoolean,
                        resolve() {
                            return true;
                        }
                    },
                    Select: {
                        type: SelectType,
                        resolve: resolvers.select,
                        args: {
                            filters: { type: new GraphQLList(RuleType(mapping)) }
                        },
                    }
                }
            })
        });
    });
}
function build(mapping, schemaLoader) {
    return Promise.resolve(schemaLoader).then(info => {
        const {resolvers} = info;
        const RuleType = require('./types/RuleType')
        const SelectType = require('./types/SelectType')(mapping, resolvers);
        return new GraphQLSchema({
            query: new GraphQLObjectType({
                name: 'TextTile',
                fields: {
                    check: {
                        type: GraphQLBoolean,
                        resolve() {
                            return true;
                        }
                    },
                    Select: {
                        type: SelectType,
                        resolve: resolvers.select,
                        args: {
                            filters: { type: new GraphQLList(RuleType(mapping)) }
                        },
                    }
                }
            })
        });
    });
}
console.log(b);
console.log(graphql)
module.exports = { build:b };