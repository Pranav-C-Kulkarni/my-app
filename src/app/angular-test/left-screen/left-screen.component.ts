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
  isExpanded: boolean = false;

  selectNode(node: any) {
    // if (this.isExpanded) {
      this.nodeSelected.emit(node);
    //   console.log(node)
    // }
  }

  toggleNode(nodeValue: any) {
    nodeValue.isExpanded = !nodeValue.isExpanded;
    this.isExpanded = nodeValue.isExpanded;
  }
}
