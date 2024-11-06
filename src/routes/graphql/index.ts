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
  GraphQLBoolean,
} from 'graphql';

import { UUIDType } from './types/uuid.js';
import { ChangeUserInputType, CreateUserInputType, UserType } from '../users/user-type.js';
import { memberTypeId, MemberType } from '../member-types/member-type.js';
import { ChangeProfileInputType, CreateProfileInputType, ProfileType } from '../profiles/profile-type.js';
import { ChangePostInputType, CreatePostInputType, PostType } from '../posts/post-type.js';
import { MemberTypeId } from '../member-types/schemas.js';
import depthLimit from 'graphql-depth-limit';

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
        args: { id: { type: UUIDType } },
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
        args: { id: { type: UUIDType } },
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
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: UserType,
        args: {
          dto: { type: CreateUserInputType },
        },
        async resolve(
          _,
          args: { dto: { name: string; balance: number } },
          { prisma }: FastifyInstance,
        ) {
          return prisma.user.create({ data: args.dto });
        },
      },
      createPost: {
        type: PostType,
        args: { dto: { type: CreatePostInputType } },
        resolve: async (
          _,
          args: { dto: { title: string; content: string; authorId: string } },
          { prisma }: FastifyInstance,
        ) => {
          return await prisma.post.create({ data: args.dto });
        },
      },
      createProfile: {
        type: ProfileType,
        args: { dto: { type: CreateProfileInputType } },
        resolve: async (
          _,
          args: {
            dto: {
              isMale: boolean;
              yearOfBirth: number;
              memberTypeId: MemberTypeId;
              userId: string;
            };
          },
          { prisma }: FastifyInstance,
        ) => {
          return await prisma.profile.create({ data: args.dto });
        },
      },
      deleteUser: {
        type: GraphQLBoolean,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          try {
            await prisma.user.delete({ where: { id } });
            return true;
          } catch {
            return false;
          }
        },
      },
      deletePost: {
        type: GraphQLBoolean,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          try {
            await prisma.post.delete({ where: { id } });
            return true;
          } catch {
            return false;
          }
        },
      },
      deleteProfile: {
        type: GraphQLBoolean,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          try {
            await prisma.profile.delete({ where: { id } });
            return true;
          } catch {
            return false;
          }
        },
      },
      changeUser: {
        type: UserType,
        args: {
          id: { type: UUIDType },
          dto: { type: ChangeUserInputType },
        },
        resolve: async (
          _,
          args: { id: string; dto: { name: string; balance: number } },
          { prisma }: FastifyInstance,
        ) => {
          const { id, dto } = args;
          return await prisma.user.update({
            where: { id: id },
            data: dto,
          });
        },
      },
      changePost: {
        type: PostType,
        args: {
          id: { type: UUIDType },
          dto: { type: ChangePostInputType },
        },
        resolve: async (
          _,
          args: { id: string; dto: { title: string; content: string } },
          { prisma }: FastifyInstance,
        ) => {
          const { id, dto } = args;
          return await prisma.post.update({
            where: { id: id },
            data: dto,
          });
        },
      },
      changeProfile: {
        type: ProfileType,
        args: {
          id: { type: UUIDType },
          dto: { type: ChangeProfileInputType },
        },
        resolve: async (
          _,
          args: { id: string; dto: { isMale: boolean; yearOfBirth: number } },
          { prisma }: FastifyInstance,
        ) => {
          const { id, dto } = args;
          return await prisma.profile.update({
            where: { id: id },
            data: dto,
          });
        },
      },
      subscribeTo: {
        type: GraphQLBoolean,
        args: {
          userId: { type: UUIDType },
          authorId: { type: UUIDType },
        },
        resolve: async (
          _,
          args: { userId: string; authorId: string },
          { prisma }: FastifyInstance,
        ) => {
          const { userId, authorId } = args;
          try {
            await prisma.subscribersOnAuthors.create({
              data: {
                subscriberId: userId,
                authorId: authorId,
              },
            });
            return true;
          } catch {
            return false;
          }
        },
      },
      unsubscribeFrom: {
        type: GraphQLBoolean,
        args: {
          userId: { type: UUIDType },
          authorId: { type: UUIDType },
        },
        resolve: async (
          _,
          args: { userId: string; authorId: string },
          { prisma }: FastifyInstance,
        ) => {
          const unsubscribed = await prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: args.userId,
                authorId: args.authorId,
              },
            },
          });
          return unsubscribed ? true : false;
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
      const validateErrors = validate(schema, parse(query), [depthLimit(5)]);
      if (validateErrors.length > 0) {
        return {data: null, errors: validateErrors};
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
