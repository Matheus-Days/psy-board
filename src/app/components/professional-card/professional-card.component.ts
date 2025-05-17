import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { UserPublicData } from '../../services/user.service';
import { SafeUrlPipe } from '../../pages/config/safe-url.pipe';
@Component({
  selector: 'app-professional-card',
  templateUrl: './professional-card.component.html',
  styleUrl: './professional-card.component.scss',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    SafeUrlPipe,
  ],
  animations: [
    trigger('expandContent', [
      state(
        'collapsed',
        style({
          height: '0',
          opacity: 0,
          overflow: 'hidden',
          'padding-top': '0',
          'padding-bottom': '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
          overflow: 'hidden',
          'padding-top': '*',
          'padding-bottom': '*',
        })
      ),
      transition('collapsed <=> expanded', [animate('200ms ease-in-out')]),
    ]),
    trigger('rotateIcon', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('collapsed <=> expanded', [animate('200ms')]),
    ]),
  ],
})
export class ProfessionalCardComponent {
  private snackBar = inject(MatSnackBar);

  _opened = input<boolean>(false, { alias: 'opened' });
  data = input.required<UserPublicData>();

  opened = signal(false);

  constructor() {
    effect(() => {
      this.opened.set(this._opened());
    });
  }

  copyPhoneToClipboard() {
    navigator.clipboard.writeText(this.data().phone).then(() => {
      this.snackBar.open(
        'Número de telefone copiado para a área de transferência.',
        'Fechar',
        {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        }
      );
    });
  }
}
