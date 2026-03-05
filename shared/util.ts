import { marshall } from '@aws-sdk/util-dynamodb';
import { Movie, Actor, Role } from './types';

type Entity = Movie | Actor | Role;

export const generateItem = (entity: Entity) => {
  let PK: string;
  let SK: string;

  if ('title' in entity) {
    // Movie item
    PK = `m#${entity.movieId}`;
    SK = `m#${entity.movieId}`;
  } else if ('bio' in entity) {
    // Actor item
    PK = `a#${entity.actorId}`;
    SK = `a#${entity.actorId}`;
  } else {
    // Role item
    PK = `m#${entity.movieId}`;
    SK = `a#${entity.actorId}`;
  }

  return {
    PutRequest: {
      Item: marshall({ PK, SK, ...entity }),
    },
  };
};

export const generateBatch = (data: Entity[]) => data.map(generateItem);