import { ComponentFixture, TestBed } from '@angular/core/testing';

import { homePage } from './home.page';

describe('homePage', () => {
  let component: homePage;
  let fixture: ComponentFixture<homePage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(homePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
