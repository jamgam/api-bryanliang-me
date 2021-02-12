const express = require('express')
const hash = require('object-hash')
const config = require('dotenv').config()
const cors = require('cors')

const graphql = require('graphql')
const { graphqlHTTP } = require('express-graphql')
const { GraphQLSchema } = graphql
const { query } = require('./schemas/queries')
const { mutation } = require('./schemas/mutations')

const schema = new GraphQLSchema({
  query,
  mutation
});

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static('public'))

app.use('/graphQl', (req, res, next) => {
  const { query, verificationHash } = req.body
  const correctHash = hash({query, key: process.env.SECRET_KEY})
  if (verificationHash === correctHash) {
    next()
  } else {
    console.warn('HASH MISMATCH', verificationHash, correctHash)
    res.sendStatus(401)
  }
})

app.use(
  '/graphQl',
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);

app.post('/score', (req, res, next) => {
  let valid = false

  const { score, time, verificationHash } = req.body
  
  if (hash({score, time, key: process.env.SECRET_KEY}) === verificationHash) {
    valid = true
  }

  res.json(valid)
})

app.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})