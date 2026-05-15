import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  totalRecords = input.required<number>();
  rows = input<number>(10);
  page = input<number>(1);
  rowsOptions = input<number[]>([5, 10, 25]);
  
  pageChange = output<number>();
  rowsChange = output<number>();

  totalPages = computed(() => Math.ceil(this.totalRecords() / this.rows()) || 1);

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    const range: (number | string)[] = [];

    // Simple logic for < 7 pages
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        range.push(i);
      }
      return range;
    }

    // Complex logic for many pages
    if (current <= 4) {
      range.push(1, 2, 3, 4, 5, '...', total);
    } else if (current >= total - 3) {
      range.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    } else {
      range.push(1, '...', current - 1, current, current + 1, '...', total);
    }

    return range;
  });

  onPageClick(p: number | string): void {
    if (typeof p === 'number' && p !== this.page()) {
      this.pageChange.emit(p);
    }
  }

  prev(): void {
    if (this.page() > 1) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  next(): void {
    if (this.page() < this.totalPages()) {
      this.pageChange.emit(this.page() + 1);
    }
  }

  onRowsChange(newValue: number): void {
    console.log('Rows changed to:', newValue);
    if (newValue) {
      this.rowsChange.emit(newValue);
    }
  }
}
