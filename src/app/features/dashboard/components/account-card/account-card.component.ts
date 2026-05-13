import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from '../../data/models/account.model';

@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-card.component.html',
  styleUrl: './account-card.component.scss'
})
export class AccountCardComponent {
  // Using modern Signal Input
  account = input<Account | undefined>();
}
