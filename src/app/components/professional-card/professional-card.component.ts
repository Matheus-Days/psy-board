import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-professional-card',
  templateUrl: './professional-card.component.html',
  styleUrl: './professional-card.component.scss',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  animations: [
    trigger('expandContent', [
      state('collapsed', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden',
        'padding-top': '0',
        'padding-bottom': '0',
      })),
      state('expanded', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden',
        'padding-top': '*',
        'padding-bottom': '*',
      })),
      transition('collapsed <=> expanded', [
        animate('200ms ease-in-out')
      ])
    ]),
    trigger('rotateIcon', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('collapsed <=> expanded', [
        animate('200ms')
      ])
    ])
  ],
})
export class ProfessionalCardComponent {
  opened = signal(false);
}
