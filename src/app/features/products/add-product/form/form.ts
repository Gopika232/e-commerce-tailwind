import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatSelectModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css'],
})
export class Form {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<Form>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product; mode: 'add' | 'edit' }
  ) {
    this.form = this.fb.group({
      id: [data?.product?.id ?? null],
      name: [data?.product?.name ?? '', Validators.required],
      description: [data?.product?.description ?? ''],
      price: [data?.product?.price ?? null, Validators.required],
      category: [data?.product?.category ?? ''],
      stock: [data?.product?.stock ?? null],
    });
  }
  categories: string[] = ['Men','Women','Kids','Electronics','Accessories'];
  async save() {
    if (this.form.invalid) return;

    const v: Product = this.form.value;

    if (this.data.mode === 'add') {
      await this.productService.add(v);
      this.dialogRef.close(true);
    } else {
      await this.productService.update(v);
      this.dialogRef.close(true);
    }

  }

}