import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { extractSidebarItems } from '../../../utils/extract-sidebar-items.util';
import { NavItem } from '../../models/nav-item.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly router = inject(Router);
  readonly navItems: NavItem[] = extractSidebarItems(this.router.config);
}
