import { Component, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ProfessionalCardComponent } from '../../components/professional-card/professional-card.component';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginResult, UserPublicData, UserService } from '../../services/user.service';
import { SafeUrlPipe } from '../config/safe-url.pipe';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatStepperModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
    SafeUrlPipe,
    ProfessionalCardComponent,
  ],
})
export class RegisterComponent {
  http = inject(HttpClient);
  userService = inject(UserService);
  router = inject(Router);

  crpId = new FormControl<string>('000001', {
    nonNullable: true,
    validators: [Validators.required],
  });
  name = new FormControl<string>('Exemplo de nome', {
    nonNullable: true,
    validators: [Validators.required],
  });
  address = new FormControl<string>('Exemplo de endereço', {
    nonNullable: true,
    validators: [Validators.required],
  });
  psycologicalSpecialty = new FormControl<string>('Exemplo de especialidade', {
    nonNullable: true,
    validators: [Validators.required],
  });
  professionalDataForm = new FormGroup({
    crpId: this.crpId,
    name: this.name,
    address: this.address,
    psycologicalSpecialty: this.psycologicalSpecialty,
  });

  phone = new FormControl<string>('(11) 99999-9999', {
    nonNullable: true,
    validators: [Validators.required],
  });
  instagramAddress = new FormControl<string>('@exemplo', {
    nonNullable: true,
  });
  contactDataForm = new FormGroup({
    phone: this.phone,
    instagramAddress: this.instagramAddress,
  });

  targetAudience = new FormControl<string>('Exemplo de público alvo', {
    nonNullable: true,
    validators: [Validators.required],
  });
  serviceModality = new FormControl<string[]>(['Individual'], {
    nonNullable: true,
    validators: [Validators.required],
  });
  paymentMethod = new FormControl<string[]>(['Espécie', 'Cartão de crédito'], {
    nonNullable: true,
    validators: [Validators.required],
  });
  acceptedInsurances = new FormControl<string>('Exemplo de convênios aceitos', {
    nonNullable: true,
  });
  serviceDataForm = new FormGroup({
    targetAudience: this.targetAudience,
    serviceModality: this.serviceModality,
    paymentMethod: this.paymentMethod,
    acceptedInsurances: this.acceptedInsurances,
  });

  picture = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  pictureForm = new FormGroup({
    picture: this.picture,
  });

  registrationForm = new FormGroup({
    professionalDataForm: this.professionalDataForm,
    contactForm: this.contactDataForm,
    serviceDataForm: this.serviceDataForm,
    pictureForm: this.pictureForm,
  });

  loginResult = signal<LoginResult | null>(null);
  imagePreviewUrl = signal<string | null>(null);
  userPublicData = signal<UserPublicData | null>(null);

  private picFile: File | null = null;

  constructor() {
    this.userService.checkAuthenticated().then(user => {
      if (user) {
        this.loginResult.set({
          registerCompleted: false,
          user,
        });
      }
    })
  }

  async onSubmit() {
    const loggedUser = this.loginResult()?.user;

    if (!loggedUser) throw new Error('User not logged in.');
    if (!this.picFile) throw new Error('Picture not selected.');

    await this.userService.registerUser(loggedUser.uid, {
      crpId: this.crpId.value,
      name: this.name.value,
      address: this.address.value,
      psycologicalSpecialty: this.psycologicalSpecialty.value,
      phone: this.phone.value,
      instagramAddress: this.instagramAddress.value,
      targetAudience: this.targetAudience.value,
      serviceModality: this.serviceModality.value,
      paymentMethod: this.paymentMethod.value,
      acceptedInsurances: this.acceptedInsurances.value,
      picture: this.picFile,
    });

    this.userPublicData.set(await this.userService.fetchUserPublicData(loggedUser.uid));
  }

  async login() {
    const res = await this.userService.loginWithGoogle();

    if (res.registerCompleted) {
      this.router.navigate(['/config']);
    } else {
      this.loginResult.set(res);
    }
  }

  onPictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    this.picFile = input.files[0];
    const imgUrl = URL.createObjectURL(this.picFile);
    this.imagePreviewUrl.set(imgUrl);
  }
}
