import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html'
})
export class Navbar {
  cartCount = 0;

  constructor(cartService: CartService) {
    cartService.getCart().subscribe(c => this.cartCount = c.length);
  }
}
