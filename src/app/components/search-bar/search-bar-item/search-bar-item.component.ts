import { Component } from '@angular/core';

@Component({
  selector: 'search-bar-item',
  template: '<ng-content />',
  host: {
    class: 'mat-body-large',
  },
  styles: `
    :host {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      min-height: 4.5rem;
      color: var(--mat-sys-on-surface);
    }
  `,
})
export class SearchBarItemComponent {}
