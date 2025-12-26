import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart$ = new BehaviorSubject<any[]>([]);

  getCart() {
    return this.cart$.asObservable();
  }

  addToCart(product: Product) {
    const cart = this.cart$.value;
    const item = cart.find(p => p.id === product.id);

    if (item) {
      if (item.qty < product.stock) item.qty++;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    this.cart$.next([...cart]);
  }
  add(product: Product): void {
    const updated = [...this.cart$.value, product];
    this.cart$.next(updated);
  }
  remove(id: number) {
    this.cart$.next(this.cart$.value.filter(p => p.id !== id));
  }

  total() {
    return this.cart$.value.reduce((sum, i) => sum + i.price * i.qty, 0);
  }
}
