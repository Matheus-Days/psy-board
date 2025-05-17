import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { SafeUrlPipe } from './safe-url.pipe';
import { MatSelectModule } from '@angular/material/select';
import {
  UserService,
  UserPublicData,
  UserFormData,
} from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

type FormData = {
  [K in keyof UserPublicData]: FormControl<UserPublicData[K]>;
};

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
    SafeUrlPipe,
  ],
})
export class ConfigComponent {
  userService = inject(UserService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  form: FormGroup<FormData> | undefined;
  initialValues: UserPublicData | null = null;
  private picFile: File | null = null;

  constructor() {
    this.initForm(this.userService.userData as UserPublicData);
  }

  private initForm(data: UserPublicData) {
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
      psycologicalSpecialty: new FormControl<string>(
        data.psycologicalSpecialty,
        {
          validators: [Validators.required],
          nonNullable: true,
        }
      ),
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
      picture: new FormControl<string>(data.picture, {
        nonNullable: true,
      }),
    });

    this.form.controls.serviceModality.valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.picFile = file;
    }
  }

  async onSubmit() {
    if (!this.form || !this.initialValues || !this.userService.userData) return;

    const currentValues = this.form.getRawValue();
    const changedFields: Partial<UserFormData> = {};
    const initialValues = this.initialValues;

    Object.keys(currentValues).forEach(key => {
      const typedKey = key as keyof UserFormData;
      if (
        JSON.stringify(currentValues[typedKey]) !==
        JSON.stringify(initialValues[typedKey])
      ) {
        changedFields[typedKey] = currentValues[typedKey] as any;
      }
    });

    if ('picture' in changedFields && changedFields.picture) {
      changedFields.picture = this.picFile || undefined;
    }

    await this.userService.updateUserData(
      this.userService.userData['uid'],
      changedFields
    );
    this.snackBar.open('Dados atualizados com sucesso!', 'Fechar', {
      duration: 4000,
    });
  }

  async removeUser() {
    const proceed = confirm('Tem certeza que deseja apagar seu cadastro?');
    if (!proceed) return;

    if (!this.userService.userData) return;
    await this.userService.unregisterUser(this.userService.userData['uid']);
    this.router.navigate(['/']);
  }

  resetPanel(controlNames: (keyof UserPublicData)[]) {
    if (!this.form || !this.initialValues) return;

    controlNames.forEach(controlName => {
      const initialValue = this.initialValues?.[controlName];
      if (initialValue !== undefined) {
        this.form?.get(controlName)?.setValue(initialValue);
      }
    });
  }

  shouldDisable(controlNames: (keyof UserPublicData)[]): boolean {
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
}
