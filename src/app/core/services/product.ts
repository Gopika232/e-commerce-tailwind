import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { saveSecure, loadSecure } from '../../utils/secure-storage.util';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private storageKey = 'products';
  private data: Product[] = [];
  private products$ = new BehaviorSubject<Product[]>([]);
  private initialized = false;

  constructor() {
    this.init();
  }

  // 🔄 Initialize data from Secure Storage
  private async init() {
    if (!this.initialized) {
      const stored = await loadSecure(this.storageKey);

      this.data = stored ?? this.getDefaultProducts();
      this.products$.next([...this.data]);
      this.initialized = true;

      // Save defaults first time
      if (!stored) {
        await saveSecure(this.storageKey, this.data);
      }
    }
  }

  // 🧾 Default Products
  private getDefaultProducts(): Product[] {
    return [
      { id: 1, name: 'Men Shirt', category: 'Men', description: 'Cotton Shirt', price: 1200, stock: 10, image: 'https://via.placeholder.com/150' },
      { id: 2, name: 'Women Dress', category: 'Women', description: 'Floral Dress', price: 1500, stock: 8, image: 'https://via.placeholder.com/150' },
      { id: 3, name: 'Men Jeans', category: 'Men', description: 'Denim Jeans', price: 2000, stock: 5, image: 'https://via.placeholder.com/150' },
      { id: 4, name: 'Women Top', category: 'Women', description: 'Casual Top', price: 800, stock: 15, image: 'https://via.placeholder.com/150' },
      { id: 5, name: 'Men Shoes', category: 'Men', description: 'Sports Shoes', price: 2500, stock: 6, image: 'https://via.placeholder.com/150' },
      { id: 6, name: 'Women Sandals', category: 'Women', description: 'Stylish Sandals', price: 1200, stock: 12, image: 'https://via.placeholder.com/150' },
      { id: 7, name: 'Men T-Shirt', category: 'Men', description: 'Round Neck Tee', price: 700, stock: 20, image: 'https://via.placeholder.com/150' },
      { id: 8, name: 'Women Skirt', category: 'Women', description: 'Pleated Skirt', price: 900, stock: 10, image: 'https://via.placeholder.com/150' },
      { id: 9, name: 'Men Jacket', category: 'Men', description: 'Leather Jacket', price: 3500, stock: 3, image: 'https://via.placeholder.com/150' },
      { id: 10, name: 'Women Blouse', category: 'Women', description: 'Silk Blouse', price: 1800, stock: 7, image: 'https://via.placeholder.com/150' },
    ];
  }

  // 📦 Save products securely
  private async saveProducts() {
    await saveSecure(this.storageKey, this.data);
  }

  // 👀 Get all products
  list(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  // ➕ Add product
  async add(product: Product) {
    await this.init();
    product.id = this.data.length
      ? Math.max(...this.data.map(p => p.id)) + 1
      : 1;

    this.data.push(product);
    this.products$.next([...this.data]);
    await this.saveProducts();
  }

  // ✏ Update product
  async update(updated: Product) {
    await this.init();
    const index = this.data.findIndex(p => p.id === updated.id);

    if (index > -1) {
      this.data[index] = updated;
      this.products$.next([...this.data]);
      await this.saveProducts();
    }
  }

  // 🗑 Delete product
  async delete(id: number) {
    await this.init();
    this.data = this.data.filter(p => p.id !== id);
    this.products$.next([...this.data]);
    await this.saveProducts();
  }

  // 🔍 Get by ID (Reactive)
  getProductById$(id: number): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  // 🔍 Get by ID (Sync)
  getProductById(id: number): Product | undefined {
    return this.data.find(p => p.id === id);
  }
}
