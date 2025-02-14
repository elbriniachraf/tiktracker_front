import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionContactsComponent } from './gestion-contacts.component';

describe('GestionContactsComponent', () => {
  let component: GestionContactsComponent;
  let fixture: ComponentFixture<GestionContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionContactsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
