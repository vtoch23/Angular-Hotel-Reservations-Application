import { AfterViewInit, ChangeDetectionStrategy, Component, forwardRef, input, Input, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, UntypedFormGroup } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Icons } from './icons';
import { distinctUntilChanged, map, Observable, startWith, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-material-icon',
  templateUrl: './material-icon.component.html',
  styleUrl: './material-icon.component.css',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MaterialIconComponent), multi: true}
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialIconComponent implements AfterViewInit, OnInit, OnDestroy, ControlValueAccessor{
  
  filteredIcons$: Observable<string[]>;
  filteredIconsCount: number;

  readonly formControl = new FormControl('');
  icons: string[];

  private onChange = (_:any) => {};
  private onTouched = () => {};

  private readonly _destroy$ = new Subject<void>();

  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;

  ngOnInit(): void {
    this.icons = Icons;
    this.setupIconChangeSubscription();
  }

  ngAfterViewInit() {
    this.setupFilteredIconsObservable();

  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    //this.filterIcons(this.formControl.value)
  }

  writeValue(icon: string): void {
    if (icon !== this.formControl.value) {
      this.formControl.setValue(icon)
    }
  }

  markAsTouched(): void {
    this.onTouched();
  }
  onSelection(value: string | null): void {
    this.formControl.setValue(value, {emitEvent: false})
  } 
  
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  resetForm(): void {
    this.autocomplete.options.first.deselect();
    this.formControl.reset();
  }

  trackByIconName = (_: number, iconName: string) => iconName;

  private setupIconChangeSubscription(): void {
    this.formControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      )
      .subscribe((iconName: string | null) => {
        this.onChange(iconName);
        this.onTouched();
      });
  }
  private setupFilteredIconsObservable(): void {
    this.filteredIcons$ = this.formControl.valueChanges
      .pipe(
        startWith(this.formControl.value),
        map((iconName: string) => this.filterIcons(iconName)),
        tap((values: string[]) => this.filteredIconsCount = values.length)
      );
  }

  private filterIcons(userInput: string): string[] {
    if (!userInput) {
      return this.icons;
    }
    const filterValue = userInput.toLowerCase();
    return this.icons.filter(option => option.toLowerCase().includes(filterValue))
  }
}
