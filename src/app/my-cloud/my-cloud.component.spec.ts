import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCloudComponent } from './my-cloud.component';

describe('MyCloudComponent', () => {
  let component: MyCloudComponent;
  let fixture: ComponentFixture<MyCloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCloudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
