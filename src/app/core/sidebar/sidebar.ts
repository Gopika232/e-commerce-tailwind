import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {

  categories: string[] = ['All', 'Men', 'Women', 'Electronics', 'Kids', 'Accessories'];

  @Output() categorySelected = new EventEmitter<string>();

  activeSection: 'categories' | 'lists' = 'categories';

  showSection(section: 'categories' | 'lists') {
    this.activeSection = section;
  }

  selectCategory(category: string) {
    console.log('Selected category:', category);
  }

}
