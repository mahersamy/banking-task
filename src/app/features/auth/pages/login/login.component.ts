import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../../../shared/validation/password.validator';
import { AuthFacade } from '../../data/auth.facade';
import { LoginDto } from '../../models/dto/login.dto';
import { FieldErrorComponent } from '../../../../shared/components/field-error/field-error.component';
import { LoadingDirective } from '../../../../shared/directive/loading.diractive';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';

import { CommonModule } from '@angular/common';
import { AuthState } from '../../data/auth.state';

@Component({
  selector: 'app-login.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    IconFieldModule,
    InputIconModule,
    FieldErrorComponent,
    LoadingDirective,
    MessageModule
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authFacade = inject(AuthFacade);
  readonly authState = inject(AuthState);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordValidator]],
  });

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.authFacade.login(this.form.value as LoginDto);
  }
}
