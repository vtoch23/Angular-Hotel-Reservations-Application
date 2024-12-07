import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialIconComponent } from './material-icon.component';

describe('MaterialIconComponent', () => {
  let component: MaterialIconComponent;
  let fixture: ComponentFixture<MaterialIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
