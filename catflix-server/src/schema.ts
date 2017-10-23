import { readFileSync } from 'fs';
import { addErrorLoggingToSchema, makeExecutableSchema } from 'graphql-tools';
import { logger } from './logger';
import resolve from './resolver';
// TODO copy graphql file
const schemaContent = readFileSync(
  __dirname + '/../src/schema/schema.graphqls',
  'utf8'
);
const schemaLogger = { log: e => logger.error(e) };
const schema = makeExecutableSchema({
  typeDefs: schemaContent,
  resolvers: resolve
});
addErrorLoggingToSchema(schema, schemaLogger);
export default schema;
