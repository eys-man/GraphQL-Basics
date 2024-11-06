
import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import { UUIDType } from '../graphql/types/uuid.js';
import { Post } from '../graphql/types/types.js';
import { PrismaClient } from '@prisma/client';

export const PostType: GraphQLObjectType<Post, { prisma: PrismaClient }> = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

export const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    authorId: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});
export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});
