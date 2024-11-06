import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { FastifyInstance } from 'fastify';
import { UUIDType } from '../graphql/types/uuid.js';
import { Profile } from '../graphql/types/types.js';
import { MemberType, memberTypeId } from '../member-types/member-type.js';
import { MemberTypeId } from '../member-types/schemas.js';

export const ProfileType: GraphQLObjectType<Profile, FastifyInstance> =
  new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: { type: UUIDType },
      isMale: { type: GraphQLBoolean },
      yearOfBirth: { type: GraphQLInt },
      memberTypeId: { type: GraphQLString },
      userId: { type: UUIDType },
      user: {
        type: UUIDType,
        resolve: async ({ userId }, _, { prisma }: FastifyInstance) => {
          return await prisma.user.findUnique({ where: { id: userId } });
        },
      },
      memberType: {
        type: MemberType,
        resolve: async (
          { memberTypeId }: { memberTypeId: MemberTypeId },
          _,
          { prisma }: FastifyInstance,
        ) => {
          return await prisma.memberType.findUnique({ where: { id: memberTypeId } });
        },
      },
    }),
  });
  
export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: { type: UUIDType },
    memberTypeId: { type: memberTypeId },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  }),
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: { type: memberTypeId },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  }),
});
