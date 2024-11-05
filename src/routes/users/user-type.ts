import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import { UUIDType } from '../graphql/types/uuid.js';
import { FastifyInstance } from 'fastify';
import { ProfileType } from '../profiles/profile-type.js';
import { PostType } from '../posts/post-type.js';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: async ({ id }, _, { prisma }: FastifyInstance) => {
        return await prisma.profile.findUnique({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          where: { userId: id },
        });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }, _, { prisma }: FastifyInstance) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return await prisma.post.findMany({ where: { authorId: id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }, _, { prisma }: FastifyInstance) => {
        return await prisma.user.findMany({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          where: { subscribedToUser: { some: { subscriberId: id } } },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }, _, { prisma }: FastifyInstance) => {
        return await prisma.user.findMany({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          where: { userSubscribedTo: { some: { authorId: id } } },
        });
      },
    },
  }),
});
