import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardFacade } from '../../data/dashboard.facade';
import { Customer } from '../../data/models/customer.model';
import { SegmentBadgeComponent } from '../../components/segment-badge/segment-badge.component';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, SegmentBadgeComponent],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss'
})
export class CustomersListComponent implements OnInit {
  readonly facade = inject(DashboardFacade);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.facade.loadCustomers();
  }

  onSelectCustomer(customer: Customer): void {
    this.router.navigate(['/dashboard/customers', customer.CIF]);
  }
}
