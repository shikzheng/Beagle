const schema = require('./schema')
const { graphql } = require('graphql')

class TextTileLanguage {
    constructor(mapping, adapter) {
        this._adapter = adapter;
        this.mapping = mapping;
        this.ready = Promise.all([
            schema.build(mapping, adapter.getSchema()).then(schema => {
                this.schema = schema;
                return schema;
            })
        ])
    }

    query(query) {
        return this.ready.then(() => {
            console.log('queting', this.schema, query, this.mapping);
            console.log({mapping: this.mapping});
            return graphql(this.schema, query, {}, {mapping: this.mapping});
        })
    }
}

module.exports = TextTileLanguage