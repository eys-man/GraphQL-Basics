import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { FastifyInstance } from 'fastify';
import { UUIDType } from '../graphql/types/uuid.js';
import { MemberType } from '../member-types/member-type.js';
import { MemberTypeId } from '../member-types/schemas.js';

export const ProfileType: GraphQLObjectType =
  new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUIDType) },
      isMale: { type: GraphQLBoolean },
      yearOfBirth: { type: GraphQLInt },
      memberTypeId: { type: GraphQLString },
      userId: { type: new GraphQLNonNull(UUIDType) },
      user: {
        type: new GraphQLNonNull(UUIDType),
        resolve: async ({ userId }, _, { prisma }: FastifyInstance) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
