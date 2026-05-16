import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoItem } from './interfaces/info-item.interfaces';

@Component({
  selector: 'app-info-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-grid.component.html',
  styleUrl: './info-grid.component.scss'
})
export class InfoGridComponent {
  items = input.required<InfoItem[]>();
}
