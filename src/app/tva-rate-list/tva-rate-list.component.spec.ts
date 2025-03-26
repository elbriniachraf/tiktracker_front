import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TvaRateListComponent } from './tva-rate-list.component';

describe('TvaRateListComponent', () => {
  let component: TvaRateListComponent;
  let fixture: ComponentFixture<TvaRateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvaRateListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvaRateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
