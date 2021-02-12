const graphql = require("graphql")
const pgClient = require('../psqlAdapter')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean } = graphql
const { ScoreType } = require("./types")

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  type: "Mutation",
  fields: {
    addScore: {
      type: ScoreType,
      args: {
        score: { type: GraphQLID },
        username: { type: GraphQLString },
        duration: { type: GraphQLString },
      },
      resolve(parentValue, {score, username, duration}) {
        const query = `INSERT INTO score(score, username, duration) VALUES ($1, $2, $3) RETURNING *`;
        const values = [
          score, 
          username, 
          duration
        ];

        return pgClient
          .query  (query, values)
          .then(res => res.rows[0])
          .catch(err => err);
      }
    },
    updateUsername: {
      type: ScoreType,
      args: {
        id: { type: GraphQLString},
        username: { type: GraphQLString },
      },
      resolve(parentValue, {id, username}) {
        const query = `UPDATE score SET username = $1 WHERE id = $2 RETURNING *`;
        const values = [ 
          username, 
          id,
        ];

        return pgClient
          .query  (query, values)
          .then(res => res.rows[0])
          .catch(err => err);
      }
    },
  }
});

exports.mutation = RootMutation;