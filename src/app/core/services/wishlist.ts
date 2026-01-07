import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { saveSecure, loadSecure } from '../../utils/secure-storage.util';

@Injectable({ providedIn: 'root' })
export class WishlistService {

  private storageKey = 'wishlist';
  private wishlist: Product[] = [];
  private wishlist$ = new BehaviorSubject<Product[]>([]);
  private initialized = false;

  constructor() {
    this.init();
  }

 private async init(): Promise<void> {
  if (!this.initialized) {
    const stored = await loadSecure(this.storageKey);
    this.wishlist = stored ?? [];
    this.wishlist$.next([...this.wishlist]);
    this.initialized = true;
  }
}


  private async save() {
    await saveSecure(this.storageKey, this.wishlist);
  }

  /* Get Wishlist */
  getWishlist(): Observable<Product[]> {
    return this.wishlist$.asObservable();
  }

  /* Add to Wishlist */
  async add(product: Product) {
    await this.init();

    const exists = this.wishlist.some(p => p.id === product.id);
    if (!exists) {
      this.wishlist.push(product);
      this.wishlist$.next([...this.wishlist]);
      await this.save();
    }
  }

  /* Remove from Wishlist */
  async remove(productId: number) {
    await this.init();
    this.wishlist = this.wishlist.filter(p => p.id !== productId);
    this.wishlist$.next([...this.wishlist]);
    await this.save();
  }
  /* Toggle Wishlist */
async toggle(product: Product) {
  await this.init();
  const exists = this.wishlist.some(p => p.id === product.id);
  exists ? await this.remove(product.id) : await this.add(product);
}
  /* Check if in Wishlist */
async isInWishlistAsync(productId: number): Promise<boolean> {
  await this.init();
  return this.wishlist.some(p => p.id === productId);
}
}
