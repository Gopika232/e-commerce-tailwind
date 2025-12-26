import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html'
})
export class Cart implements OnInit {

  cart$!: Observable<any[]>;

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.getCart();
  }
}
