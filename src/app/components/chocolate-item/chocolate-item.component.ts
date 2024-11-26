import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chocolate } from '../../models/chocolate';

@Component({
  selector: 'app-chocolate-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './chocolate-item.component.html',
  styleUrl: './chocolate-item.component.css'
})
export class ChocolateItemComponent {
  @Input() chocolate!: Chocolate
  @Output() addToCart = new EventEmitter<Chocolate>()

  onAddToCart() {
    this.addToCart.emit(this.chocolate);
  }
}
