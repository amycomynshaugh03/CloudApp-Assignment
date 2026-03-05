export type Movie = {
  movieId: number;
  title: string;
  releaseDate: string;
  overview: string;
};

export type Actor = {
  actorId: number;
  name: string;
  dateOfBirth: string;
  bio: string;
};

export type Role = {
  movieId: number;
  actorId: number;
  roleName: string;
  roleDescription: string;
};