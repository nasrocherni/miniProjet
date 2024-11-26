import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChocolatesAdminComponent } from './chocolates-admin.component';

describe('ChocolatesAdminComponent', () => {
  let component: ChocolatesAdminComponent;
  let fixture: ComponentFixture<ChocolatesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChocolatesAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChocolatesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
