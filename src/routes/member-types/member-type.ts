import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';

import { GraphQLEnumType } from 'graphql';
import { MemberTypeId } from './schemas.js';

export const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: { value: MemberTypeId.BASIC },
    [MemberTypeId.BUSINESS]: { value: MemberTypeId.BUSINESS },
  },
});

export const MemberType =
  new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
      id: { type: memberTypeId },
      discount: { type: GraphQLFloat },
      postsLimitPerMonth: { type: GraphQLInt },
    }),
  });
