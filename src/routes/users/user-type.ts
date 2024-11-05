import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import { UUIDType } from '../graphql/types/uuid.js';
import { FastifyInstance } from 'fastify';
import { User } from '../graphql/types/types.js';
import { ProfileType } from '../profiles/profile-type.js';
import { PostType } from '../posts/post-type.js';

export const UserType: GraphQLObjectType<User, FastifyInstance> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: async ({ id }, _, { prisma }: FastifyInstance) => {
        return await prisma.profile.findUnique({ where: { userId: id } });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }, _, { prisma }: FastifyInstance) => {
        return await prisma.post.findMany({ where: { authorId: id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }, _, { prisma }: FastifyInstance) => {
        return await prisma.user.findMany({
          where: { subscribedToUser: { some: { subscriberId: id } } },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }, _, { prisma }: FastifyInstance) => {
        return await prisma.user.findMany({
          where: { userSubscribedTo: { some: { authorId: id } } },
        });
      },
    },
  }),
});
