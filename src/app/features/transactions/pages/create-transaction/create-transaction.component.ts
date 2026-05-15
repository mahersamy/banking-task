import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionsFacade } from '../../data/transactions.facade';
import { DashboardFacade } from '../../../dashboard/data/dashboard.facade';
import { FieldErrorComponent } from '../../../../shared/components/field-error/field-error.component';
import {
  futureDateValidator,
  maxDecimalsValidator,
  exceedsBalanceValidator,
} from '../../validators/transaction.validators';

// PrimeNG
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { LoadingDirective } from '../../../../shared/directive/loading.diractive';
import { CreateTransactionDto } from '../../data/dto/create-transaction.dto';
import { cardType } from '../../data/models/transaction.model';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FieldErrorComponent,
    CardModule,
    SelectButtonModule,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    DatePickerModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    LoadingDirective
  ],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.scss'
})
export class CreateTransactionComponent implements OnInit {
  readonly facade = inject(TransactionsFacade);
  readonly dashboard = inject(DashboardFacade);
  readonly cardType = cardType;
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly today = new Date();

  form = this.fb.group({
    type: [cardType.DEBIT, Validators.required],
    amount: [
      null,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(100_000),
        maxDecimalsValidator(2),
        // Cross-field validator — reads balance at call time
        exceedsBalanceValidator(() => this.dashboard.selectedAccount()?.balance ?? 0),
      ],
    ],
    date: ['', [Validators.required, futureDateValidator()]],
    merchant: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    category: ['', Validators.required],
  });

  constructor() {
    // Re-validate amount when account balance changes/loads
    effect(() => {
      this.dashboard.selectedAccount(); // subscribe to signal
      if (this.form.controls.amount.value) {
        this.form.controls.amount.updateValueAndValidity();
      }
    });
  }

  ngOnInit(): void {
    this.facade.loadAll(); // ensure categories loaded

    // Re-hydrate state from Path Params on refresh
    this.route.paramMap.subscribe(params => {
      const cif = params.get('id');
      const accId = params.get('accountId');
      if (cif) this.dashboard.loadCustomerDetail(cif);
      if (accId) this.dashboard.selectAccount(accId);
    });

    // Re-run amount validators when type changes (Debit/Credit affects exceedsBalance)
    this.form.controls.type.valueChanges.subscribe(() => {
      this.form.controls.amount.updateValueAndValidity();
    });
  }


  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.facade.createTransaction(
      this.form.getRawValue() as unknown as CreateTransactionDto,
      () => this.cancel()
    );
  }


  cancel(): void {
    const cif = this.route.snapshot.paramMap.get('id');
    const accId = this.route.snapshot.paramMap.get('accountId');
    if (cif && accId) {
      this.router.navigate(['/dashboard', 'customers', cif, 'accounts', accId, 'transactions']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
