import gql from "graphql-tag";

export const typeDefs = gql`
  # Entités

  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
  }

  type Location {
    latitude: Float!
    longitude: Float!
  }

  input LocationInput {
    latitude: Float!
    longitude: Float!
  }

  type Event {
    id: ID!
    name: String!
    body: String!
    timestamp: String!
    brand: String
    sourceApp: String!
    eventType: EventType!
    priority: Priority!
    metadata: Metadata
    userId: ID
    location: Location
    tags: [String!]
    relatedEventId: ID
  }

  scalar Metadata

  enum EventType {
    purchase
    refund
    browse
    wishlist_add
    cart_add
    cart_remove
    checkout
  }

  enum Priority {
    low
    medium
    high
  }

  # Requêtes

  type Query {
    getUserById(id: ID!): User
    getEventById(id: ID!): Event
    allUsers: [User!]!
    allEvents: [Event!]!
    userByEmail(email: String!): User
  }

  # Mutations

  type Mutation {
    createUser(email: String!, password: String!, firstName: String, lastName: String): User!
    updateUser(id: ID!, email: String, firstName: String, lastName: String): User!
    deleteUser(id: ID!): Boolean!

    createEvent(
      name: String!,
      body: String!,
      timestamp: String!,
      sourceApp: String!,
      eventType: EventType!,
      priority: Priority!,
      brand: String,
      metadata: Metadata,
      userId: ID,
      location: LocationInput,
      tags: [String!],
      relatedEventId: ID
    ): Event!

    updateEvent(
      id: ID!,
      name: String,
      body: String,
      timestamp: String,
      sourceApp: String,
      eventType: EventType,
      priority: Priority,
      brand: String,
      metadata: Metadata,
      userId: ID,
      location: LocationInput,
      tags: [String!],
      relatedEventId: ID
    ): Event!

    deleteEvent(id: ID!): Boolean!

    loginUser(email: String!, password: String!): AuthResponse!
  }

  type AuthResponse {
    token: String!
    user: User!
  }
`;