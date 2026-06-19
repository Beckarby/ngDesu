import { ComponentFixture, TestBed } from '@angular/core/testing';

import { searchPage } from './search.page';

describe('searchPage', () => {
  let component: searchPage;
  let fixture: ComponentFixture<searchPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(searchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
