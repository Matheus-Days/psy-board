import {
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  host: {
    '[class.disabled]': 'disabled()',
    '[class.focused]': 'isFocused()',
    '(click)': 'focus()',
  },
})
export class SearchBarComponent {
  placeholder = input<string>('');
  disabled = input<boolean>(false);

  focused = output<void>();
  blurred = output<void>();
  valueChanged = output<string>();

  input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  isFocused = signal(false);

  _onFocus(): void {
    this.isFocused.set(true);
    this.focused.emit();
  }

  _onBlur(): void {
    this.isFocused.set(false);
    this.blurred.emit();
  }

  _onChange(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    this.valueChanged.emit(input.value);
  }

  focus(): void {
    this.isFocused.set(true);
    this.input().nativeElement.focus();
  }
}
