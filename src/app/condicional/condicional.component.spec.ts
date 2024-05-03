import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicionalComponent } from './condicional.component';

describe('CondicionalComponent', () => {
  let component: CondicionalComponent;
  let fixture: ComponentFixture<CondicionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CondicionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CondicionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
