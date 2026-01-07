import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { Cart } from '../../cart/cart';
import { CartService } from '../../../core/services/cart';
import { ProductService } from '../../../core/services/product';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Form } from '../add-product/form/form';
import { Confirm } from './confirm/confirm';
import { WishlistService } from '../../../core/services/wishlist';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, Form, Confirm],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private dialog: MatDialog,
    private wishlistService: WishlistService
  ) { }
  add(product: Product) {
    this.cartService.addToCart(product);
  }
  edit(row: Product) {
    this.dialog.open(Form, {
      width: '480px', data: {
        mode: 'edit', product: row
      }
    });
  }
isWishlisted = false;

async ngOnInit() {
  this.isWishlisted = await this.wishlistService.isInWishlistAsync(this.product.id);
}

async toggleWishlist(product: Product) {
  await this.wishlistService.toggle(product);
  this.isWishlisted = await this.wishlistService.isInWishlistAsync(product.id);
}

  delete(row: Product) {
    console.log('DELETE CLICKED:', row);
    console.log('ID TYPE:', typeof row.id, row.id);

    this.dialog.open(Confirm, {
      data: { title: 'Delete Product', message: `Delete ${row.name}?` }
    }).afterClosed().subscribe(async result => {
      if (result) {
        await this.productService.delete(row.id!);
      }
    });

  }
}