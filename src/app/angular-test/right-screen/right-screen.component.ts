import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AngularTestComponent } from '../angular-test.component';

@Component({
  selector: 'app-right-screen',
  standalone: true,
  imports: [CommonModule, AngularTestComponent],
  templateUrl: './right-screen.component.html',
  styleUrls: ['./right-screen.component.css'] // Corrected `styleUrl` to `styleUrls`
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
          // Update the count and check for the latest modification date
          this.fileOccurrences[filename].count++;
          const existingDate = new Date(this.fileOccurrences[filename].latestFile.modification_date);

          if (modificationDate > existingDate) {
            this.fileOccurrences[filename].latestFile = file; // Update to the latest file
          }
        } else {
          // Initialize with count 1 and current file
          this.fileOccurrences[filename] = { count: 1, latestFile: file };
        }
      });
    }
  }

  getUniqueFiles(): Array<{ [key: string]: any }> {
    const uniqueFiles: Array<{ [key: string]: any }> = [];

    for (const filename in this.fileOccurrences) {
      if (this.fileOccurrences.hasOwnProperty(filename)) {
        uniqueFiles.push(this.fileOccurrences[filename].latestFile); // Only push the latest file
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

  // Recursive function to count all files within a folder (including child directories)
  countFilesInFolder(folder: any, excludeFile?: string): number {
    let fileCount = 0;

    for (const key in folder) {
      const item = folder[key];

      // If it's a file, count it (and exclude the specific file if needed)
      if (item.type === 'file' && key !== excludeFile) {
        fileCount++;
      }

      // If it's a directory, recursively count files inside the directory
      else if (item.type === 'directory') {
        fileCount += this.countFilesInFolder(item, excludeFile);
      }
    }

    return fileCount;
  }

  // Recursive function to find folders containing the file by filename
  getFoldersRecursive(data: any, filename: string, parentFolder: any = null): any[] {
    let results: any[] = [];

    // Traverse each key in the current directory
    for (const key in data) {
      const item = data[key];

      // If the current item is a file and matches the filename
      if (item.type === 'file' && key === filename) {
        if (parentFolder) {
          // Count other files including in subfolders
          const otherFiles = this.countFilesInFolder(data, filename); // Exclude the current file

          // Add folder details if it's part of a folder
          results.push({
            name: parentFolder.name,
            creation_date: parentFolder.creation_date,
            otherFiles: otherFiles // Includes child folder files
          });
        }
      } else if (item.type === 'directory') {
        // Recursive call if the current item is a directory
        results = results.concat(this.getFoldersRecursive(item, filename, {
          name: key,
          creation_date: item.modification_date
        }));
      }
    }

    return results;
  }

  // Function to get folders containing the file
  getFolders(filename: string): any[] {
    return this.getFoldersRecursive(this.data, filename);
  }
}
