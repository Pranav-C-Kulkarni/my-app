import { Component } from '@angular/core';
import { LeftScreenComponent } from './left-screen/left-screen.component';
import { RightScreenComponent } from './right-screen/right-screen.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-angular-test',
  standalone: true,
  imports: [LeftScreenComponent, RightScreenComponent, CommonModule],
  templateUrl: './angular-test.component.html',
  styleUrl: './angular-test.component.css'
})
export class AngularTestComponent {
  fileData: any;
  filteredFiles: Array<{ [key: string]: any }> | undefined;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fileData = JSON.parse(e.target.result);
        this.filteredFiles = this.extractFiles(this.fileData);
      };
      reader.readAsText(file);
    }
  }

  extractFiles(data: any, path = ''): Array<{ [key: string]: any }> {
    const files: Array<{ [key: string]: any }> = [];
    for (const key in data) {
        if (data[key].type === 'file') {
            files.push({
                filename: key,
                path: path + '/' + key,
                modification_date: data[key].modification_date,
                hash: data[key].hash,
            });
        } else if (data[key].type === 'directory') {
            files.push(...this.extractFiles(data[key], path + '/' + key));
        }
    }
    return files;
}

  onNodeSelected(node: any) {
    this.filteredFiles = this.extractFiles(node);
  }
}
