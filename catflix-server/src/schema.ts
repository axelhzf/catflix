import { readFileSync } from 'fs';
import { addErrorLoggingToSchema, makeExecutableSchema } from 'graphql-tools';
import { logger } from './logger';
import { rootResolver } from './resolvers/rootResolver';

// TODO copy graphql file
const schemaContent = readFileSync(
  __dirname + '/../src/schema/schema.graphqls',
  'utf8'
);
const schemaLogger = { log: e => logger.error(e) };
const schema = makeExecutableSchema({
  typeDefs: schemaContent,
  resolvers: rootResolver as any
});
addErrorLoggingToSchema(schema, schemaLogger);
export default schema;
