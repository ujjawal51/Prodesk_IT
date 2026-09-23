export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const GENRES = [
  { id: 'all', name: 'All Movies' },
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }
];

export const FALLBACK_MOVIES = [
  {
    id: 101,
    title: 'Interstellar',
    release_date: '2014-11-05',
    vote_average: 8.7,
    vote_count: 34200,
    runtime: 169,
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    poster_path: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&q=80',
    backdrop_path: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    genre_ids: [878, 18, 12],
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 18, name: 'Drama' }, { id: 12, name: 'Adventure' }]
  },
  {
    id: 102,
    title: 'Inception',
    release_date: '2010-07-15',
    vote_average: 8.8,
    vote_count: 35800,
    runtime: 148,
    tagline: 'Your mind is the scene of the crime.',
    overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible.',
    poster_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80',
    backdrop_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    genre_ids: [878, 28, 12],
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }]
  },
  {
    id: 103,
    title: 'The Dark Knight',
    release_date: '2008-07-16',
    vote_average: 9.0,
    vote_count: 32000,
    runtime: 152,
    tagline: 'Welcome to a world without rules.',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
    poster_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80',
    backdrop_path: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&q=80',
    genre_ids: [28, 80, 18],
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }]
  },
  {
    id: 104,
    title: 'Cyberpunk Odyssey',
    release_date: '2023-11-12',
    vote_average: 8.4,
    vote_count: 14200,
    runtime: 135,
    tagline: 'The future is encoded in the shadow.',
    overview: 'In a neon-drenched metropolis of 2099, a rogue hacker unravels a subterranean conspiracy that threatens human consciousness itself.',
    poster_path: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
    backdrop_path: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
    genre_ids: [878, 28, 53],
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 28, name: 'Action' }, { id: 53, name: 'Thriller' }]
  },
  {
    id: 105,
    title: 'Avatar: The Way of Water',
    release_date: '2022-12-14',
    vote_average: 7.7,
    vote_count: 11500,
    runtime: 192,
    tagline: 'Return to Pandora.',
    overview: 'Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, and the lengths they go to keep each other safe.',
    poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    backdrop_path: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    genre_ids: [878, 12, 14],
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }]
  },
  {
    id: 106,
    title: 'Spirited Away',
    release_date: '2001-07-20',
    vote_average: 8.5,
    vote_count: 16000,
    runtime: 125,
    tagline: 'The tunnel led to a mysterious world.',
    overview: 'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.',
    poster_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80',
    backdrop_path: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
    genre_ids: [16, 14, 12],
    genres: [{ id: 16, name: 'Animation' }, { id: 14, name: 'Fantasy' }, { id: 12, name: 'Adventure' }]
  },
  {
    id: 107,
    title: 'Dune: Part Two',
    release_date: '2024-02-27',
    vote_average: 8.6,
    vote_count: 5800,
    runtime: 166,
    tagline: 'Long live the fighters.',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
    poster_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80',
    backdrop_path: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&q=80',
    genre_ids: [878, 12, 18],
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }]
  },
  {
    id: 108,
    title: 'Pulp Fiction',
    release_date: '1994-09-10',
    vote_average: 8.5,
    vote_count: 27000,
    runtime: 154,
    tagline: 'Just because you are a character doesn\'t mean that you have character.',
    overview: 'A burger-loving hitman, his philosophical partner, a drug-addled gangster moll, and a washed-up boxer intersect in four tales of violence and redemption.',
    poster_path: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
    backdrop_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    genre_ids: [53, 80],
    genres: [{ id: 53, name: 'Thriller' }, { id: 80, name: 'Crime' }]
  }
];
