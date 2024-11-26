import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReveiwsComponent } from './reveiws.component';

describe('ReveiwsComponent', () => {
  let component: ReveiwsComponent;
  let fixture: ComponentFixture<ReveiwsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReveiwsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReveiwsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
