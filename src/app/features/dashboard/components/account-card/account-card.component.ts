import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Account } from '../../data/models/account.model';
import { DashboardFacade } from '../../data/dashboard.facade';

@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-card.component.html',
  styleUrl: './account-card.component.scss'
})
export class AccountCardComponent {
  private readonly router = inject(Router);
  private readonly dashboardFacade = inject(DashboardFacade);

  // Using modern Signal Input
  account = input<Account | undefined>();

  viewTransactions(): void {
    if (this.account()) {
      this.dashboardFacade.selectAccount(this.account()!.id);
      // Navigate to: customers/:id/accounts/:accountId/transactions
      this.router.navigate(['/dashboard', 'customers', this.account()!.customerId, 'accounts', this.account()!.id, 'transactions']);
    }
  }
}
