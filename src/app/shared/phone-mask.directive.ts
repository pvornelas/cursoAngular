import { ElementRef, Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const masks = [
  '(1',
  '(11',
  '(11) 1',
  '(11) 11',
  '(11) 111',
  '(11) 1111',
  '(11) 1111-1',
  '(11) 1111-11',
  '(11) 1111-111',
  '(11) 1111-1111',
  '(11) 11111-1111'
];

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[phoneMaskBr]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PhoneMaskDirective,
      multi: true
    }
  ]
})
export class PhoneMaskDirective implements ControlValueAccessor {

  private value: any;
  private oldValue = '';
  private onTouched: () => void = () => { };
  private onChanged: (_: any) => void = () => { };

  constructor(private input: ElementRef) { }

  private updateInputView(): void {
    const input = this.input.nativeElement;
    const cursorPosition = input.selectionStart;
    const value = this.value;
    const valueWithCursor = `${value.substring(0, cursorPosition)} '^' ${value.substring(cursorPosition)}`;

    const formatted = this.format(valueWithCursor);

    if (value === '') {
      return;
    }

    if (!formatted) {
      input.value = this.oldValue;
      return;
    }

    const newValue = formatted.formatted;
    if (newValue !== input.value) {
      input.value = newValue;
      input.setSelectionRange(formatted.cursorPosition, formatted.cursorPosition);
    }

    this.oldValue = newValue;
    this.onChanged(newValue);
  }

  @HostListener('input')
  onInput() {
    this.value = this.input.nativeElement.value;
    this.updateInputView();
  }

  writeValue(value: any): void {
    this.value = value;
    this.input.nativeElement.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private format(numero: string): any {
    let lastCharIndex = 0;
    const cleanValue = this.clean(numero);
    const charCount = cleanValue.replace(/\^/gm, '').length;
    if (charCount === 0) {
      return {
        formatted: '',
        cursorPosition: 0
      };
    }
    const mask = masks[charCount - 1];
    if (charCount > 1 && !mask) {
      return null;
    }
    let cursorPosition;
    const formatted = mask.split('').map((c, i) => {
      if (c === '1') {
        if (cleanValue[lastCharIndex] === '^') {
          cursorPosition = i + 1;
          lastCharIndex++;
        }

        lastCharIndex++;
        return cleanValue[lastCharIndex - 1];
      } else {
        return c;
      }
    }).join('');

    if (!cursorPosition) {
      cursorPosition = formatted.length;
    }

    cursorPosition++;

    return {
      formatted: `${formatted}`,
      cursorPosition
    };
  }

  private clean(numero: string): string {
    return numero.toString().replace(/[^\d\^]/gm, '');
  }
}
