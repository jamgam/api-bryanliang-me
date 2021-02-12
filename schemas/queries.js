const pgClient = require('../psqlAdapter')
const { GraphQLObjectType, GraphQLID, GraphQLList } = require('graphql')
const { ScoreType } = require('./types')

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  type: 'Query',
  fields: {
    score: {
      type: ScoreType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM score WHERE id=$1`;
        const values = [args.id];
        console.log('query?:', query, values)
        return pgClient
          .query(query, values)
          .then(res => {
            console.log('rows: ', res.rows)
            return res.rows[0]
          })
          .catch(err => err);
      }
    },
    highscores: {
      type: new GraphQLList(ScoreType),
      resolve() {
        const query = `SELECT * FROM score ORDER BY score DESC LIMIT 10 OFFSET 0`
        return pgClient.query(query).then(res => res.rows).catch(err => err)
      }
    },

  }
});

exports.query = RootQuery;