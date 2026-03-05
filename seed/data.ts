import { Movie, Actor, Role } from '../shared/types';

export const movies: Movie[] = [
  {
    movieId: 1001,
    title: 'The Hunger Games',
    releaseDate: '2012-03-23',
    overview: 'In a dystopian future, sixteen year old Katniss Everdeen volunteers to take her sister\'s place in a televised death match between children, representing her impoverished district.',
  },
  {
    movieId: 1002,
    title: 'Harry Potter and the Philosopher\'s Stone',
    releaseDate: '2001-11-16',
    overview: 'A young boy discovers on his eleventh birthday that he is a wizard and is invited to attend Hogwarts School of Witchcraft and Wizardry, where he uncovers the truth about his past.',
  },
  {
    movieId: 1003,
    title: 'The Lion King',
    releaseDate: '1994-06-24',
    overview: 'A young lion prince flees his kingdom after the murder of his father, only to return years later to reclaim his throne from his villainous uncle.',
  },
  {
    movieId: 1004,
    title: 'Titanic',
    releaseDate: '1997-12-19',
    overview: 'A young aristocratic woman falls in love with a kind but poor artist aboard the ill-fated maiden voyage of the RMS Titanic.',
  },
  {
    movieId: 1005,
    title: 'Avengers: Endgame',
    releaseDate: '2019-04-26',
    overview: 'After the devastating events of Infinity War, the remaining Avengers assemble one final time to reverse Thanos\'s actions and restore balance to the universe.',
  },
];

export const actors: Actor[] = [
  {
    actorId: 2001,
    name: 'Jennifer Lawrence',
    dateOfBirth: '1990-08-15',
    bio: 'An American actress who became a household name playing Katniss Everdeen in The Hunger Games franchise. She won the Academy Award for Best Actress for Silver Linings Playbook, making her the second youngest winner in history.',
  },
  {
    actorId: 2002,
    name: 'Daniel Radcliffe',
    dateOfBirth: '1989-07-23',
    bio: 'A British actor who rose to worldwide fame playing Harry Potter in the eight-film franchise. He has since taken on diverse stage and screen roles to establish himself beyond the iconic character.',
  },
  {
    actorId: 2003,
    name: 'Leonardo DiCaprio',
    dateOfBirth: '1974-11-11',
    bio: 'An American actor and film producer who won the Academy Award for Best Actor for The Revenant. Known for his collaborations with Martin Scorsese and James Cameron, he is widely considered one of the greatest actors of his generation.',
  },
  {
    actorId: 2004,
    name: 'Robert Downey Jr.',
    dateOfBirth: '1965-04-04',
    bio: 'An American actor whose portrayal of Tony Stark / Iron Man across the Marvel Cinematic Universe made him one of the highest paid actors in Hollywood. His comeback story after personal struggles is considered one of the greatest in entertainment history.',
  },
  {
    actorId: 2005,
    name: 'Josh Hutcherson',
    dateOfBirth: '1992-10-12',
    bio: 'An American actor best known for playing Peeta Mellark opposite Jennifer Lawrence in The Hunger Games franchise. He began his career as a child actor and has appeared in numerous films including Bridge to Terabithia.',
  },
];

export const roles: Role[] = [
  {
    movieId: 1001,
    actorId: 2001,
    roleName: 'Katniss Everdeen',
    roleDescription: 'A brave and resourceful teenager from District 12 who volunteers to replace her younger sister in the Hunger Games. She becomes a reluctant symbol of rebellion against the Capitol.',
  },
  {
    movieId: 1001,
    actorId: 2005,
    roleName: 'Peeta Mellark',
    roleDescription: 'The male tribute from District 12 and Katniss\'s fellow competitor. His love for Katniss and his kind nature make him a fan favourite and a key piece in the games\' political drama.',
  },
  {
    movieId: 1002,
    actorId: 2002,
    roleName: 'Harry Potter',
    roleDescription: 'An orphaned boy who discovers he is a wizard and enrols at Hogwarts. He quickly discovers a dark connection between himself and the most feared dark wizard of all time.',
  },
  {
    movieId: 1004,
    actorId: 2003,
    roleName: 'Jack Dawson',
    roleDescription: 'A charming and free-spirited artist who wins a third-class ticket onto the Titanic in a poker game. He falls deeply in love with first-class passenger Rose despite the class divide between them.',
  },
  {
    movieId: 1005,
    actorId: 2004,
    roleName: 'Tony Stark / Iron Man',
    roleDescription: 'The genius billionaire and founding Avenger who ultimately makes the ultimate sacrifice to save the universe from Thanos, snapping his fingers and ending the mad titan\'s plan once and for all.',
  },
];