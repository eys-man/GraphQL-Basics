import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';
import { Member } from '../graphql/types/types.js';
import { GraphQLEnumType } from 'graphql';
import { MemberTypeId } from './schemas.js';
import { PrismaClient } from '@prisma/client';

export const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: { value: MemberTypeId.BASIC },
    [MemberTypeId.BUSINESS]: { value: MemberTypeId.BUSINESS },
  },
});

export const MemberType: GraphQLObjectType<Member, { prisma: PrismaClient }> =
  new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
      id: {
        type: memberTypeId,
      },
      discount: {
        type: GraphQLFloat,
      },
      postsLimitPerMonth: {
        type: GraphQLInt,
      },
    }),
  });
