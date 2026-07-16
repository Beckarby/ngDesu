import { Injectable, signal, computed } from '@angular/core';

export interface Anime {
  id: number;
  title: string;
  image?: string;
  userScore: number;
  criticScore: number;
  releaseDate: string;
  genres: string[];
  synopsis: string;
}

export interface Review {
  id: number;
  animeName: string;
  animeImage?: string;
  rating: number;
  review: string;
}

export interface CommunityReview {
  id: number;
  username: string;
  rating: number;
  review: string;
}

export type WatchStatus = 'to_watch' | 'watching' | 'dropped' | 'completed' | 'fav';

export const WATCH_STATUSES: { value: WatchStatus; label: string; icon: string }[] = [
  { value: 'to_watch', label: 'To Watch', icon: 'bookmark-outline' },
  { value: 'watching', label: 'Watching', icon: 'eye-outline' },
  { value: 'dropped', label: 'Dropped', icon: 'close-circle-outline' },
  { value: 'completed', label: 'Completed', icon: 'checkmark-circle-outline' },
  { value: 'fav', label: 'Favorites', icon: 'heart-outline' },
];

export interface LibraryEntry {
  id: number;
  title: string;
  status: WatchStatus;
}

@Injectable({ providedIn: 'root' })
export class AnimeStore {
  readonly animeDetails = signal<Record<number, Anime>>({
    1: { id: 1, title: 'Fullmetal Alchemist: Brotherhood', userScore: 9.3, criticScore: 9.6, releaseDate: '2009-04-05', genres: ['Action', 'Adventure', 'Fantasy'], synopsis: 'After losing their mother, brothers Edward and Alphonse Elric attempt a forbidden alchemical ritual that goes horribly wrong. Edward loses a leg and an arm, while Alphonse loses his entire body. Now Edward, armed with automail prosthetics, journeys with his brother\'s soul bound to a suit of armor to find the fabled Philosopher\'s Stone, hoping to restore what they lost. Their quest uncovers a dark conspiracy that threatens the entire nation.' },
    2: { id: 2, title: 'Steins;Gate', userScore: 9.0, criticScore: 9.2, releaseDate: '2011-04-06', genres: ['Sci-Fi', 'Thriller'], synopsis: 'Self-proclaimed mad scientist Rintaro Okabe and his friends accidentally discover a way to send messages to the past using a modified microwave. As they experiment with time travel, they attract the attention of dangerous organizations and face devastating consequences. Okabe must navigate a web of cause and effect, making impossible choices to save the people he cares about.' },
    3: { id: 3, title: 'Attack on Titan', userScore: 9.0, criticScore: 8.9, releaseDate: '2013-04-07', genres: ['Action', 'Drama', 'Fantasy'], synopsis: 'In a world where humanity lives behind massive walls to protect themselves from giant man-eating Titans, young Eren Yeager witnesses his mother being devoured during a Titan breach. Vowing revenge, he joins the military alongside his friends Mikasa and Armin. As they fight for survival, they uncover horrifying truths about the Titans and their own world.' },
    4: { id: 4, title: 'Cowboy Bebop', userScore: 9.2, criticScore: 9.5, releaseDate: '1998-04-03', genres: ['Sci-Fi', 'Action', 'Noir'], synopsis: 'Spike Spiegel and Jet Black run a bounty-hunting business aboard the spaceship Bebop, chasing criminals across the solar system. They are joined by the enigmatic Faye Valentine, the eccentric child genius Ed, and a loyal dog named Ein. Together they face danger, confront their pasts, and try to make a living in a gritty, jazz-infused future.' },
    5: { id: 5, title: 'Frieren: Beyond Journey\'s End', userScore: 9.1, criticScore: 9.4, releaseDate: '2023-09-29', genres: ['Fantasy', 'Adventure', 'Slice of Life'], synopsis: 'After a decades-long adventure, the elf mage Frieren and her party of heroes defeat the Demon King and bring peace to the land. As her mortal companions age and pass away, Frieren embarks on a new journey to understand the meaning of the connections she formed. Along the way, she takes on new companions and retraces the steps of her old adventure, reflecting on life, loss, and what it means to truly know someone.' },
    6: { id: 6, title: 'Neon Genesis Evangelion', userScore: 8.7, criticScore: 9.1, releaseDate: '1995-10-04', genres: ['Sci-Fi', 'Psychological', 'Mecha'], synopsis: 'In a post-apocalyptic world, teenager Shinji Ikari is recruited by his estranged father to pilot a giant bio-mechanical mecha called an Evangelion to defend Earth against mysterious beings known as Angels. As Shinji and the other young pilots face increasingly deadly threats, they are forced to confront their own psychological traumas and the dark secrets behind the Evangelion project.' },
    7: { id: 7, title: 'Your Lie in April', userScore: 8.8, criticScore: 8.6, releaseDate: '2014-10-10', genres: ['Romance', 'Drama', 'Music'], synopsis: 'Piano prodigy Kosei Arima loses his ability to hear the sound of his piano after his mother\'s death. Two years later, he meets the vibrant and free-spirited violinist Kaori Miyazono, who challenges him to return to the stage. Through music and friendship, Kosei begins to heal and rediscover his passion, but hidden truths threaten to shatter their fleeting time together.' },
    8: { id: 8, title: 'Kaguya-sama: Love Is War', userScore: 8.5, criticScore: 8.3, releaseDate: '2019-01-12', genres: ['Romance', 'Comedy'], synopsis: 'Miyuki Shirogane and Kaguya Shinomiya are the top students at their prestigious academy, admired by all. They are secretly in love with each other, but both are too proud to confess. What follows is a hilarious battle of wits as they scheme and manipulate to force the other to confess first, each convinced that admitting their feelings would mean losing the war of love.' },
    9: { id: 9, title: 'Barakamon', userScore: 8.4, criticScore: 8.2, releaseDate: '2014-07-06', genres: ['Slice of Life', 'Comedy'], synopsis: 'After punching a famous calligrapher who criticized his work, talented but arrogant calligrapher Seishuu Handa is exiled to a remote island to find himself. There, the loud and energetic islanders, especially the playful young girl Naru, disrupt his solitude and slowly teach him about life, community, and the true meaning of art.' },
    10: { id: 10, title: 'Demon Slayer', userScore: 8.6, criticScore: 8.4, releaseDate: '2019-04-06', genres: ['Action', 'Fantasy', 'Historical'], synopsis: 'After his family is slaughtered and his sister Nezuko is turned into a demon, kind-hearted boy Tanjiro Kamado sets out to become a demon slayer. He joins the Demon Slayer Corps to hunt down the demon responsible and find a cure for his sister. Along the way, he makes powerful allies and faces terrifying demons in breathtaking battles.' },
    11: { id: 11, title: 'Ghost in the Shell', userScore: 8.9, criticScore: 9.3, releaseDate: '1995-11-18', genres: ['Sci-Fi', 'Action', 'Cyberpunk'], synopsis: 'In a future where cybernetic enhancements are commonplace, Major Motoko Kusanagi leads Section 9, an elite counter-cyberterrorist task force. When they hunt a mysterious hacker known as the Puppet Master, the Major confronts profound questions about identity, consciousness, and what it means to be human in an increasingly digital world.' },
  });

  readonly topAnimeIds = signal<number[]>([1, 2, 3, 4, 5, 6]);
  readonly categories = signal<string[]>(['All', 'Action', 'Sci-Fi', 'Romance', 'Slice of Life', 'Fantasy']);

  readonly reviews = signal<Review[]>([
    { id: 1, animeName: 'Cowboy Bebop', rating: 9, review: 'A masterpiece of animation with incredible jazz soundtrack and deep characters.' },
    { id: 2, animeName: 'Ghost in the Shell', rating: 8, review: 'Philosophical cyberpunk classic that redefined the genre. Must watch!' },
  ]);

  readonly communityReviews = signal<CommunityReview[]>([
    { id: 1, username: 'AnimeFan42', rating: 5, review: 'Absolutely masterpiece! The storytelling, character development, and animation are top-notch. This is the kind of anime that stays with you long after you finish watching.' },
    { id: 2, username: 'MangaLover', rating: 4, review: 'Really enjoyed this one. The pacing was great and the plot kept me hooked throughout. Only minor gripes with the ending, but overall a fantastic experience.' },
    { id: 3, username: 'OtakuKing', rating: 5, review: 'One of the best anime I have ever seen. The themes are deep and thought-provoking. Every episode left me wanting more. A must-watch for any anime fan.' },
    { id: 4, username: 'NightOwl', rating: 3, review: 'It was good but not mind-blowing. Some episodes felt slow and the middle section dragged a bit. The soundtrack and visuals are beautiful though.' },
  ]);

  readonly libraryAnime = signal<LibraryEntry[]>([
    { id: 1, title: 'Cowboy Bebop', status: 'completed' },
    { id: 11, title: 'Ghost in the Shell', status: 'fav' },
    { id: 6, title: 'Neon Genesis Evangelion', status: 'watching' },
  ]);

  readonly topAnimeList = computed(() => {
    const details = this.animeDetails();
    return this.topAnimeIds()
      .map(id => details[id])
      .filter(Boolean)
      .map(a => ({
        id: a.id,
        title: a.title,
        image: a.image,
        description: a.synopsis,
        score: Math.round(((a.userScore + a.criticScore) / 2) * 10) / 10,
      }));
  });

  getAnimeById(id: number): Anime | undefined {
    return this.animeDetails()[id];
  }

  getFilteredAnime(term: string, category: string, sortBy: 'score' | 'date') {
    const all = Object.values(this.animeDetails());
    let list = all;

    if (term.trim()) {
      const t = term.toLowerCase();
      list = list.filter(a => a.title.toLowerCase().includes(t));
    }

    if (category !== 'All') {
      list = list.filter(a => a.genres.includes(category));
    }

    if (sortBy === 'score') {
      list = [...list].sort((a, b) => (b.userScore + b.criticScore) / 2 - (a.userScore + a.criticScore) / 2);
    } else {
      list = [...list].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    }

    return list;
  }

  addReview(review: Review) {
    this.reviews.update(r => [...r, review]);
  }

  updateReview(id: number, changes: Partial<Review>) {
    this.reviews.update(r => r.map(rev => rev.id === id ? { ...rev, ...changes } : rev));
  }

  deleteReview(id: number) {
    this.reviews.update(r => r.filter(rev => rev.id !== id));
  }

  getAnimeStatus(id: number): WatchStatus | null {
    return this.libraryAnime().find(a => a.id === id)?.status ?? null;
  }

  getAnimeByStatus(status: WatchStatus): LibraryEntry[] {
    return this.libraryAnime().filter(a => a.status === status);
  }

  setAnimeStatus(id: number, status: WatchStatus) {
    const title = this.animeDetails()[id]?.title ?? `Anime #${id}`;
    this.libraryAnime.update(list => {
      const exists = list.find(a => a.id === id);
      if (exists) return list.map(a => a.id === id ? { ...a, status } : a);
      return [...list, { id, title, status }];
    });
  }
}
