import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvaCalculComponent } from './tva-calcul.component';

describe('TvaCalculComponent', () => {
  let component: TvaCalculComponent;
  let fixture: ComponentFixture<TvaCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvaCalculComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvaCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
