import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SafeUrlPipe } from './safe-url.pipe';
import { MatSelectModule } from '@angular/material/select';

export type UserData = {
  crpId: string;
  name: string;
  address: string;
  psycologicalSpecialty: string;
  phone: string;
  instagramAddress: string;
  targetAudience: string;
  serviceModality: string[];
  paymentMethod: string[];
  acceptedInsurances: string;
  picture: File | null;
};

type FormData = {
  [K in keyof UserData]: FormControl<UserData[K]>;
};

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    SafeUrlPipe,
  ],
})
export class ConfigComponent {
  form: FormGroup<FormData> | undefined;
  initialValues: UserData | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  private initForm(data: UserData) {
    this.initialValues = { ...data };
    this.form = new FormGroup<FormData>({
      crpId: new FormControl<string>(data.crpId, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      name: new FormControl<string>(data.name, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      address: new FormControl<string>(data.address, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      psycologicalSpecialty: new FormControl<string>(data.psycologicalSpecialty, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      phone: new FormControl<string>(data.phone, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      instagramAddress: new FormControl<string>(data.instagramAddress, {
        nonNullable: true,
      }),
      targetAudience: new FormControl<string>(data.targetAudience, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      serviceModality: new FormControl<string[]>(data.serviceModality, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      paymentMethod: new FormControl<string[]>(data.paymentMethod, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      acceptedInsurances: new FormControl<string>(data.acceptedInsurances, {
        nonNullable: true,
      }),
      picture: new FormControl<File | null>(data.picture, {
        nonNullable: true,
      }),
    });

    this.form.controls.serviceModality.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  // Method for development purposes only
  fillSampleData() {
    this.initForm({
      crpId: '1234567890',
      name: 'Dr. João Silva',
      address: 'Rua das Flores, 123',
      psycologicalSpecialty: 'Psicologia Clínica',
      phone: '(11) 99999-9999',
      instagramAddress: 'https://www.instagram.com/dr_joaosilva',
      targetAudience: 'Adultos e adolescentes',
      serviceModality: ['Individual', 'Grupo'],
      paymentMethod: ['Cartão de crédito', 'Convênios'],
      acceptedInsurances: 'Unimed, Amil',
      picture: null,
    });
  }
  
  getSafeUrl(file: File | null): SafeUrl {
    if (!file) return '';
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.form?.controls.picture.setValue(file);
    }
  }

  onSubmit() {
    if (!this.form || !this.initialValues) return;

    const currentValues = this.form.getRawValue();
    const changedFields: Partial<UserData> = {};
    const initialValues = this.initialValues;

    Object.keys(currentValues).forEach((key) => {
      const typedKey = key as keyof UserData;
      if (JSON.stringify(currentValues[typedKey]) !== JSON.stringify(initialValues[typedKey])) {
        changedFields[typedKey] = currentValues[typedKey] as any;
      }
    });

    console.log('Campos alterados:', changedFields);
  }

  shouldDisable(controlNames: (keyof UserData)[]): boolean {
    if (!this.form || !this.initialValues) return false;
    
    const hasErrors = controlNames.some(controlName => {
      const control = this.form?.get(controlName);
      return control?.invalid || false;
    });

    const hasChanges = controlNames.some(controlName => {
      const currentValue = this.form?.get(controlName)?.value;
      const initialValue = this.initialValues?.[controlName];
      return JSON.stringify(currentValue) !== JSON.stringify(initialValue);
    });

    return !hasChanges || hasErrors;
  }

  resetPanel(controlNames: (keyof UserData)[]) {
    if (!this.form || !this.initialValues) return;
    
    controlNames.forEach(controlName => {
      const initialValue = this.initialValues?.[controlName];
      if (initialValue !== undefined) {
        this.form?.get(controlName)?.setValue(initialValue);
      }
    });
  }
}
