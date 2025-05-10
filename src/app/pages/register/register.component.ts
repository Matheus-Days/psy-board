import { Component, signal } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ProfessionalCardComponent } from "../../components/professional-card/professional-card.component";

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
    ReactiveFormsModule,
    RouterModule,
    ProfessionalCardComponent
],
})
export class RegisterComponent {
  crpId = new FormControl('', [Validators.required]);
  name = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  psycologicalSpecialty = new FormControl('', [Validators.required]);
  professionalDataForm = new FormGroup({
    crpId: this.crpId,
    name: this.name,
    address: this.address,
    psycologicalSpecialty: this.psycologicalSpecialty,
  });

  phone = new FormControl('', [Validators.required]);
  instagramAddress = new FormControl('');
  contactDataForm = new FormGroup({
    phone: this.phone,
    instagramAddress: this.instagramAddress,
  });

  targetAudience = new FormControl('', [Validators.required]);
  serviceModality = new FormControl('', [Validators.required]);
  paymentMethod = new FormControl('', [Validators.required]);
  acceptedInsurances = new FormControl('');
  serviceDataForm = new FormGroup({
    targetAudience: this.targetAudience,
    serviceModality: this.serviceModality,
    paymentMethod: this.paymentMethod,
    acceptedInsurances: this.acceptedInsurances,
  });

  picture = new FormControl<File | null>(null, [Validators.required]);
  pictureForm = new FormGroup({
    picture: this.picture,
  });

  registrationForm = new FormGroup({
    professionalDataForm: this.professionalDataForm,
    contactForm: this.contactDataForm,
    serviceDataForm: this.serviceDataForm,
    pictureForm: this.pictureForm,
  });

  logged = signal(false);
  created = signal(false);

  imagePreviewUrl: string | null = null;

  onSubmit() {
    console.log(this.registrationForm.value);
    this.created.set(true);
  }

  onPictureSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.imagePreviewUrl = URL.createObjectURL(file);
    }
  }
}
