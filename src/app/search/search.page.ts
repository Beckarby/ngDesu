import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonChip, IonSegment, IonSegmentButton, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonSpinner } from '@ionic/angular/standalone';
import { AnimeCardComponent } from '../anime-card/anime-card.component';
import { AnimeStore } from '../store/anime-store.service';
import { toProcessService, Media, SearchSort, PageInfo } from '../services/toProcess';

type SortValue = 'score' | 'date' | 'status';
const SORT_MAP: Record<SortValue, SearchSort> = {
  score: 'SCORE',
  date: 'DATE',
  status: 'STATUS',
};

const PER_PAGE = '20';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonChip, IonSegment, IonSegmentButton, IonLabel, AnimeCardComponent, IonInfiniteScroll, IonInfiniteScrollContent, IonSpinner],
})
export class searchPage {
  private store = inject(AnimeStore);

  searchTerm = '';
  selectedCategory = 'All';
  sortBy: SortValue = 'score';

  results = signal<Media[]>([]);
  pageInfo = signal<PageInfo | null>(null);
  loading = signal(false);
  loadingMore = signal(false);

  private currentRequest = 0;

  get categories() { return this.store.categories(); }

  constructor() {
    this.loadFirstPage();
  }

  onFiltersChange() {
    this.loadFirstPage();
  }

  onSearchInput(ev: CustomEvent<any>) {
    this.searchTerm = ev.detail.value ?? '';
    this.debouncedSearch();
  }

  onCategorySelect(category: string) {
    console.log('[click] search onCategorySelect', { category });
    this.selectedCategory = category;
    this.loadFirstPage();
  }

  onSortChange(ev: CustomEvent<any>) {
    this.sortBy = (ev.detail.value ?? 'score') as SortValue;
    this.loadFirstPage();
  }

  private searchTimer: ReturnType<typeof setTimeout> | null = null;
  private debouncedSearch() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadFirstPage(), 300);
  }

  async loadFirstPage() {
    const requestId = ++this.currentRequest;
    this.loading.set(true);
    try {
      const res = await toProcessService.searchAnime({
        searchText: this.searchTerm,
        page: '1',
        perPage: PER_PAGE,
        sort: SORT_MAP[this.sortBy],
        genre: this.selectedCategory === 'All' ? '' : this.selectedCategory,
      });
      if (requestId !== this.currentRequest) return; // stale
      this.results.set(res.output.media);
      this.pageInfo.set(res.output.pageInfo);
    } catch (err) {
      console.error('search failed', err);
    } finally {
      if (requestId === this.currentRequest) this.loading.set(false);
    }
  }

  async loadMore(ev: CustomEvent<void>) {
    const info = this.pageInfo();
    const target = ev.target as unknown as IonInfiniteScroll | null;
    if (!info || !info.hasNextPage) {
      target?.complete();
      return;
    }
    this.loadingMore.set(true);
    try {
      const nextPage = String(info.currentPage + 1);
      const res = await toProcessService.searchAnime({
        searchText: this.searchTerm,
        page: nextPage,
        perPage: PER_PAGE,
        sort: SORT_MAP[this.sortBy],
        genre: this.selectedCategory === 'All' ? '' : this.selectedCategory,
      });
      this.results.update(list => [...list, ...res.output.media]);
      this.pageInfo.set(res.output.pageInfo);
    } catch (err) {
      console.error('load more failed', err);
    } finally {
      this.loadingMore.set(false);
      target?.complete();
    }
  }

  cardFor(media: Media) {
    return {
      id: media.id,
      title: media.title.userPreferred || media.title.english || media.title.romaji,
      image: media.coverImage.large,
      userScore: media.averageScore,
      criticScore: undefined,
    };
  }
}
