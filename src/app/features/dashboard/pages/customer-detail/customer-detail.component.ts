import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardFacade } from '../../data/dashboard.facade';
import { DashboardState } from '../../data/dashboard.state';
import { SegmentBadgeComponent } from '../../components/segment-badge/segment-badge.component';
import { AccountCardComponent } from '../../components/account-card/account-card.component';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, SegmentBadgeComponent, AccountCardComponent],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss'
})
export class CustomerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customerFacade = inject(DashboardFacade);
  readonly customerState = inject(DashboardState)


  ngOnInit(): void {
    const cif = this.route.snapshot.paramMap.get('cif');
    if (!cif) {
      this.router.navigate(['/dashboard']);
      return;
    }
    // ← Facade handles loading state, error state, and stores result in State
    this.customerFacade.loadCustomerDetail(cif);
  }

  goBack(): void {
    this.customerFacade.clearSelection();
    this.router.navigate(['/dashboard']);
  }
}
