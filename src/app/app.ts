import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/navbar/navbar';
import { Footer } from './core/footer/footer';
import { Wishlist } from './features/wishlist/wishlist';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, CommonModule,Navbar,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fresh');
}
