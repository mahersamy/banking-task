import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersListComponent } from '../customers-list/customers-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CustomersListComponent],
  template: `<app-customers-list></app-customers-list>`
})
export class DashboardComponent {}
