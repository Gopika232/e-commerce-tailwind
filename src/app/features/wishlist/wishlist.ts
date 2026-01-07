
import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../core/services/wishlist';
import { ProductCard } from '../products/product-card/product-card';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  template:'wishlist.html'
})
export class Wishlist implements OnInit {

  wishlistProducts: Product[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistService.getWishlist().subscribe(products => {
      this.wishlistProducts = products;
    });
  }
}