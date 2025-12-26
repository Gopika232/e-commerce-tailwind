import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';
import { Product } from '../../../core/models/product.model';

import { ProductCard } from '../product-card/product-card';
import { Sidebar } from '../../../core/sidebar/sidebar';
import { Form } from '../add-product/form/form';
import { WishlistService } from '../../../core/services/wishlist';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.html',
  imports: [
    CommonModule,
    FormsModule,

    // UI
    Sidebar,
    ProductCard,

    // Material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class ProductList implements OnInit, OnChanges {

  /* ---------- Inputs ---------- */
  @Input() category = '';
  @Input() search = '';

  /* ---------- Material Table ---------- */
  dataSource = new MatTableDataSource<Product>([]);
  displayedColumns: string[] = ['name', 'category', 'price', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /* ---------- Cards ---------- */
  products: Product[] = [];
  filteredProducts: Product[] = [];

  /* ---------- Pagination ---------- */
  currentPage = 1;
  itemsPerPage = 4;
  pageSizes = [4, 8, 12];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private dialog: MatDialog
  ) {}

  /* ---------- INIT ---------- */
  ngOnInit(): void {

    // Cards data
this.productService.list().subscribe((products: Product[]) => {
  this.products = products;
  this.filter();
});



    // Material table data
    this.productService.list().subscribe(products => {
      this.dataSource.data = products;

      this.dataSource.sortingDataAccessor = (item, property) => {
        if (property === 'price') return item.price ?? 0;
        return (item as any)[property];
      };

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
  }
  

  /* ---------- On Input Change ---------- */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] || changes['search']) {
      this.filter();
    }
  }
onCategoryChange(category: string): void {
  this.category = category;
  this.filter();
}

  /* ---------- Filter ---------- */
  filter(): void {
    this.filteredProducts = this.products.filter(p => {
      const searchMatch =
        !this.search ||
        p.name.toLowerCase().includes(this.search.toLowerCase());

      const categoryMatch =
        !this.category ||
        this.category === 'All' ||
        p.category === this.category;

      return searchMatch && categoryMatch;
    });

    this.currentPage = 1;
  }

  /* ---------- Card Pagination ---------- */
  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.itemsPerPage));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  changePageSize(size: number): void {
    this.itemsPerPage = +size;
    this.currentPage = 1;
  }

  /* ---------- Actions ---------- */
  addToCart(product: Product): void {
    this.cartService.add(product);
  }

  async delete(id: number): Promise<void> {
    if (confirm('Delete this product?')) {
      await this.productService.delete(id);
    }
  }

sortPrice(order: 'low' | 'high'): void {
  this.filteredProducts = [...this.filteredProducts].sort((a, b) => {
    const priceA = a.price ?? 0;
    const priceB = b.price ?? 0;

    return order === 'low'
      ? priceA - priceB
      : priceB - priceA;
  });

  this.currentPage = 1; // reset pagination
}


  /* ---------- Dialog ---------- */
  openAdd(): void {
    this.dialog.open(Form, {
      width: '480px',
      data: { mode: 'add' }
    });
  }
}
