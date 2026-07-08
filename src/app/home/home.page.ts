import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { TopAnimeCardComponent } from '../top-anime-card/top-anime-card.component';

interface TopAnime {
  id: number;
  title: string;
  image?: string;
  description: string;
  score: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, TopAnimeCardComponent],
})
export class homePage {
  topAnime: TopAnime[] = [
    { id: 1, title: 'Fullmetal Alchemist: Brotherhood', description: 'Two brothers search for the Philosopher\'s Stone to restore their bodies after a failed alchemy experiment, uncovering a conspiracy that threatens their world.', score: 9.9 },
    { id: 2, title: 'Steins;Gate', description: 'A self-proclaimed mad scientist accidentally invents a time machine and must navigate the consequences of altering the past.', score: 9.8 },
    { id: 3, title: 'Attack on Titan', description: 'Humanity fights for survival against giant humanoid titans within walled cities, uncovering dark secrets about their world.', score: 9.7 },
    { id: 4, title: 'Cowboy Bebop', description: 'A ragtag crew of bounty hunters travels through space in search of adventure, fortune, and their troubled pasts.', score: 9.6 },
    { id: 5, title: 'Frieren: Beyond Journey\'s End', description: 'An elf mage embarks on a journey to understand humanity after outliving her adventuring party, reflecting on life, loss, and meaning.', score: 9.5 },
    { id: 6, title: 'Neon Genesis Evangelion', description: 'Teenagers pilot giant mecha to defend Earth from mysterious angels while grappling with psychological trauma and existential dread.', score: 9.4 },
  ];

  constructor() {}
}
