import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { 
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  parse,
  validate,
} from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    handler: async function (req) {
      const query = new GraphQLObjectType({
        name: 'Query',
        fields: () => {
          return {};
        },
      });

      const schema = new GraphQLSchema({ query });
      const source = req.body.query;
      const variableValues = req.body.variables;

      const validateErrors = validate(schema, parse(req.body.query));
      if (validateErrors.length) return { errors: validateErrors };

      return await graphql({
        schema: schema,
        source: source,
        contextValue: { prisma: fastify.prisma },
        variableValues: variableValues,
      });
    }
  });
};

export default plugin;
