const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString } = graphql

const ScoreType = new GraphQLObjectType({
  name: 'Score',
  type: 'Query',
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    score: { type: GraphQLString },
    duration: { type: GraphQLString },
    date: { type: GraphQLString }
  }
})


exports.ScoreType = ScoreType