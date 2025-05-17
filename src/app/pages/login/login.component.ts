import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [MatButtonModule, MatIconModule, RouterModule],
})
export class LoginComponent {
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  useService = inject(UserService);

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  form = new FormGroup({
    email: this.email,
    password: this.password,
  });

  async loginWithGoogle() {
    try {
      const res = await this.useService.loginWithGoogle();
      if (res.registerCompleted) {
        this.router.navigate(['/config']);
      } else {
        this.router.navigate(['/register']);
      }
    } catch (error) {
      this.snackBar.open('Erro ao fazer login', 'Fechar', { duration: 3000 });
    }
  }
}
