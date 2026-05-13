import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-segment-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './segment-badge.component.html',
  styleUrl: './segment-badge.component.scss'
})
export class SegmentBadgeComponent {
  // Using modern Signal Input
  segment = input<string | undefined>('');
}
