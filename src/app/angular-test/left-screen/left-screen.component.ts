import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularTestComponent } from '../angular-test.component';

@Component({
  selector: 'app-left-screen',
  standalone: true,
  imports: [CommonModule, AngularTestComponent],
  templateUrl: './left-screen.component.html',
  styleUrl: './left-screen.component.css'
})
export class LeftScreenComponent {
  @Input() data: { [key: string]: any } | undefined;
  @Output() nodeSelected = new EventEmitter<any>();

  selectNode(node: any) {
    this.nodeSelected.emit(node);
  }
}
