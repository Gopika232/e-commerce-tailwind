import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-product.html',
})
export class AddProduct {

  product: Product = {
    id: 0,
    name: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    image: ''
  };

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }
  cancel() {
    if (confirm('Discard changes?')) {
      this.router.navigate(['/products']);
    }
  }
  
  async addProduct() {
    console.log('ADDING PRODUCT:', this.product); // debug
    await this.productService.add(this.product);
    alert('Product Added Successfully');
    this.router.navigate(['/products']);
  }
}
