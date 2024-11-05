import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  parse,
  validate,
} from 'graphql';

import { UUIDType } from './types/uuid.js';
import { UserType } from '../users/user-type.js';
import { memberTypeId, MemberType } from '../member-types/member-type.js';
import { ProfileType } from '../profiles/profile-type.js';
import { PostType } from '../posts/post-type.js';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve: async (_, __, { prisma }: FastifyInstance) => {
          return await prisma.user.findMany();
        },
      },
      user: {
        type: UserType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          return await prisma.user.findUnique({ where: { id } });
        },
      },
      posts: {
        type: new GraphQLList(PostType),
        resolve: async (_, __, { prisma }: FastifyInstance) => {
          return await prisma.post.findMany();
        },
      },
      post: {
        type: PostType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          return await prisma.post.findUnique({ where: { id } });
        },
      },
      memberTypes: {
        type: new GraphQLList(MemberType),
        resolve: async (_, __, { prisma }: FastifyInstance) => {
          return await prisma.memberType.findMany();
        },
      },
      memberType: {
        type: MemberType,
        args: { id: { type: new GraphQLNonNull(memberTypeId) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          return await prisma.memberType.findUnique({
            where: { id },
          });
        },
      },
      profiles: {
        type: new GraphQLList(ProfileType),
        resolve: async (_, __, { prisma }: FastifyInstance) => {
          return await prisma.profile.findMany();
        },
      },
      profile: {
        type: ProfileType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          return await prisma.profile.findUnique({ where: { id } });
        },
      },
    },
  }),
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler({ body: { query, variables } }) {
      const validateErrors = validate(schema, parse(query));
      if (validateErrors.length > 0) {
        return {errors: validateErrors};
      }

      return await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: fastify,
      });
    },
  });
};

export default plugin;
