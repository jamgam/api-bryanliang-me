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

app.get('/', (req, res, next) => {
  res.json({api: 'api.bryanliang.me', version: '1.0.0'})
})

app.get('/.well-known/acme-challenge/cz_5C2r_UcJkBBf8pdXo0X7lIPqMIS6s0gLMFg3WB8A', (req, res, next) => {
  res.send('cz_5C2r_UcJkBBf8pdXo0X7lIPqMIS6s0gLMFg3WB8A.FhCtF_AViQAZivG8SKxnrqKtnqhQ459XAKWxz9RMosY')
})

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

app.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})