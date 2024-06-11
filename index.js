const fetch = require('node-fetch');
const { ApolloServer, gql } = require('apollo-server');
const { json } = require('express');

const typeDefs = gql`
    type User {
    id: String
    email: String
    username: String
    password: String
  }

  type Set {
    id: String
    name: String
    creator: String
    words: [String]
  }

  type Definition {
    definition: String
  }

  type Meaning {
    definitions: [Definition],
    synonyms: [String]
  }

  type Word {
    word: String
    meanings: [Meaning]
  }

  type Query {
    users: [User]
    user(id: String!): User
    sets: [Set]
    set(id: String!): Set
    word(word: String!): [Word]
  }

  type Mutation {
    register(email: String!, username: String!, password: String!): User
    login(email: String!, password: String!): User
    createSet(name: String!, creator: String!, words: [String]!): Set
  }    
`;

const resolvers = {
  Query: {
    users: () => fetchUsers(),
    user: (_, args) => fetchUserById(args.id),
    sets: () => fetchSets(),
    set: (_, args) => fetchSetById(args.id),
    word: (_, args) => fetchWordByWord(args.word)
  },
  Mutation: {
    register: (_, args) => register(args),
    login: (_, args) => login(args),
    createSet: (_, args) => createSet(args)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log('Servidor listo en', url);
});

const URLUsersAPI = 'http://localhost:5000/api/users'
const URLSetsAPI = 'http://localhost:5001/api/vocabularySets'
const URLWordsAPI = 'https://api.dictionaryapi.dev/api/v2/entries/en'

async function fetchUsers() {
    try {
        const response = await fetch(URLUsersAPI);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

async function fetchUserById(id) {
    try {
        const response = await fetch(`${URLUsersAPI}/${id}`);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

async function register({ email, username, password }) {
  try {
    const response = await fetch(`${URLUsersAPI}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

async function login({ email, password }) {
  try {
    const response = await fetch(`${URLUsersAPI}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await response.json();
    console.log(json);  // Registrar la respuesta completa
    return json;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

async function fetchSets() {
  try {
      const response = await fetch(URLSetsAPI);
      const json = await response.json();
      return json;
  } catch (error) {
      console.error("Error fetching sets:", error);
      return [];
  }
}

async function createSet({ name, creator, words }) {
  try {
    const response = await fetch(URLSetsAPI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, creator, words })
    });
    const json = await response.json();
    console.log(json);  // Registrar la respuesta completa
    return json;
  } catch (error) {
    console.error("Error creating set:", error);
    return null;
  }
}

async function fetchSetById(id) {
  try {
      const response = await fetch(`${URLSetsAPI}/${id}`);
      const json = await response.json();
      return json;
  } catch (error) {
      console.error("Error fetching set:", error);
      return [];
  }
}

async function fetchWordByWord(word) {
  try {
      const response = await fetch(`${URLWordsAPI}/${word}`);
      const json = await response.json();
      return json;
  } catch (error) {
      console.error("Error fetching word:", error);
      return [];
  }
}