import { GraphQLClient } from 'graphql-request'

export const backendBase = (import.meta.env.PUBLIC_PAYLOAD_URL || 'http://localhost:3000').replace(/\/$/, '')

export const graphqlClient = new GraphQLClient(`${backendBase}/api/graphql`)
