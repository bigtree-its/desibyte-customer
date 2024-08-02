import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-progress',
  templateUrl: './order-progress.component.html',
  styleUrls: ['./order-progress.component.css']
})
export class OrderProgressComponent {

  @Input() status?: string = "New";
  @Input() serviceMode?: string = "COLLECTION";
}
