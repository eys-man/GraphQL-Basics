import { UUID } from 'crypto';
import { MemberTypeId } from '../../member-types/schemas.js';

export type Member = {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
};

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

export type User = {
  id: UUID;
  name: string;
  balance: number;
  posts: Post[];
  profile: Profile;
  userSubscribedTo: Subscription[];
  subscribedToUser: Subscription[];
};

export type Profile = {
  id: UUID;
  isMale: boolean;
  yearOfBirth: number;
  userId: UUID;
  memberTypeId: MemberTypeId;
};

export type Subscription = {
  subscriberId: UUID;
  authorId: UUID;
};
