import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { DashboardFacade } from '../../data/dashboard.facade';
import { SegmentBadgeComponent } from '../../components/segment-badge/segment-badge.component';
import { AccountCardComponent } from '../../components/account-card/account-card.component';
import { MiniStatementComponent } from '../../components/mini-statement/mini-statement.component';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    CommonModule,
    SegmentBadgeComponent,
    AccountCardComponent,
    MiniStatementComponent
  ],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss'
})
export class CustomerDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly facade = inject(DashboardFacade);

  readonly accounts = this.facade.customerAccounts;

  readonly customer = this.facade.selectedCustomerDetail;

  readonly loading = this.facade.isLoading;
  readonly error = this.facade.error;

  ngOnInit(): void {
    const cif = this.route.snapshot.paramMap.get('id');

    if (!cif) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.facade.loadCustomerDetail(cif);
  }

  goBack(): void {
    this.facade.clearSelection();
    this.router.navigate(['/dashboard']);
  }
}