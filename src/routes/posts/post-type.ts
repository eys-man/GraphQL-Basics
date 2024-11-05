
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../graphql/types/uuid.js';
import { Post } from '../graphql/types/types.js';
import { PrismaClient } from '@prisma/client';

export const PostType: GraphQLObjectType<Post, { prisma: PrismaClient }> = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  }),
});
