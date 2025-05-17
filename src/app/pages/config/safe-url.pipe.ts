import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true,
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(file: File | string | null): SafeUrl {
    if (!file) return '';
    const url = typeof file === 'string' ? file : URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
} 