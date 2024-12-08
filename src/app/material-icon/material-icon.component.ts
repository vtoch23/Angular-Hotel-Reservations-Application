import { AfterViewInit, ChangeDetectionStrategy, Component, forwardRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
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
export class MaterialIconComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor{
  public form: FormGroup = new FormGroup({
    icon: new FormControl('')
  })

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

    this.formControl.addValidators(this.validate.bind(this));
    if(this.form.hasValidator(Validators.required)) {
      this.formControl.addValidators(Validators.required)
    }
    this.setupIconChangeSubscription();
  }

  ngAfterViewInit() {
    this.setupFilteredIconsObservable();
    console.log('after view init')
    console.log(this.form.valueChanges)
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  registerOnChange(fn: any): void {
    console.log('onChange');
    this.form.valueChanges.subscribe(fn);
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    console.log("on blur");
    this.onTouched = fn;
  }

  writeValue(icon: string): void {
    icon && this.formControl.setValue(icon, {emitEvent: false});
    }

  markAsTouched(): void {
    console.log("on blur");
    this.onTouched();
  }
  onSelection(value: string | null): void {
    this.formControl.setValue(value, {emitEvent: false})
  } 
  
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if(value === '' || value === null || value === undefined) {
      return null;
    }
    const isValid = this.icons.includes(value);
    return isValid ? null : {invalidOption: true}
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
      .subscribe((iconName: string) => {
        this.onChange(iconName);
        this.onTouched();
      });
  }
  private setupFilteredIconsObservable(): void {
    console.log('initialise setupFilteredIconsObservable')
    this.filteredIcons$ = this.formControl.valueChanges
      .pipe(
        startWith(this.formControl.value),
        map((iconName: string) => this.filterIcons(iconName)),
        tap((values: string[]) => this.filteredIconsCount = values.length)
      );
      console.log(this.filteredIconsCount)
  }

  private filterIcons(userInput: string): string[] {
    if (!userInput) {
      return this.icons;
    }
    const filterValue = userInput.toLowerCase();
    console.log(filterValue)
    return this.icons.filter(option => option.toLowerCase().includes(filterValue))
  }
}
