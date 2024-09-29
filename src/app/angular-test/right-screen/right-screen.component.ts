import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AngularTestComponent } from '../angular-test.component';

@Component({
  selector: 'app-right-screen',
  standalone: true,
  imports: [CommonModule, AngularTestComponent],
  templateUrl: './right-screen.component.html',
  styleUrls: ['./right-screen.component.css']
})
export class RightScreenComponent implements OnChanges {
  @Input() data: { [key: string]: any } | undefined;
  @Input() files: Array<{ [key: string]: any }> | undefined;
  expandedFile: any;
  fileOccurrences: { [key: string]: { count: number, latestFile: any } } = {};

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateOccurrences();
  }

  calculateOccurrences() {
    this.fileOccurrences = {};

    if (this.files) {
      this.files.forEach(file => {
        const filename = file['filename'];
        const modificationDate = new Date(file['modification_date']);

        if (this.fileOccurrences[filename]) {
          this.fileOccurrences[filename].count++;
          const existingDate = new Date(this.fileOccurrences[filename].latestFile.modification_date);

          if (modificationDate > existingDate) {
            this.fileOccurrences[filename].latestFile = file;
          }
        } else {
          this.fileOccurrences[filename] = { count: 1, latestFile: file };
        }
      });
    }
  }

  getUniqueFiles(): Array<{ [key: string]: any }> {
    const uniqueFiles: Array<{ [key: string]: any }> = [];

    for (const filename in this.fileOccurrences) {
      if (this.fileOccurrences.hasOwnProperty(filename)) {
        uniqueFiles.push(this.fileOccurrences[filename].latestFile);
      }
    }

    return uniqueFiles;
  }

  toggleRow(file: any) {
    this.expandedFile = this.expandedFile === file ? null : file;
  }

  getOccurrences(filename: string): number {
    return this.fileOccurrences[filename]?.count || 0;
  }

  getFoldersRecursive(data: any, filename: string, parentFolder: any = null): any[] {
    let results: any[] = [];

    for (const key in data) {
      const item = data[key];
      if (item.type === 'file' && key === filename) {
        if (parentFolder) {
          results.push({
            name: parentFolder.name,
            creation_date: parentFolder.creation_date,
            otherFiles: Object.keys(data).filter(k => data[k].type === 'file' && k !== filename).length
          });
        }
      } else if (item.type === 'directory') {
        results = results.concat(this.getFoldersRecursive(item, filename, { name: key, creation_date: item.modification_date }));
      }
    }
    return results;
  }

  getFolders(filename: string): any[] {
    return this.getFoldersRecursive(this.data, filename);
  }
}
