import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  imports: [CommonModule,MatButtonModule,MatDialogModule],
  templateUrl: './confirm.html',
  styleUrls: ['./confirm.css'],
})
export class Confirm {
  constructor(
    public dialogRef: MatDialogRef<Confirm>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

    close() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}