import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true,
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(file: File | null): SafeUrl {
    if (!file) return '';
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
  }
} 