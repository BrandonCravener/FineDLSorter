import { TableGroup } from './../../../../interfaces';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../../providers/config.service';
import {
  MatSort,
  MatPaginator,
  MatChipInputEvent,
  MatTableDataSource
} from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private tableGroups: TableGroup[] = [];

  public newGroupForm: FormGroup;
  public dataSource: MatTableDataSource<TableGroup>;
  public displayedColumns = ['folder', 'extensions'];

  constructor(
    private configService: ConfigService,
    private formbuilder: FormBuilder
  ) {
    this.newGroupForm = formbuilder.group({
      name: ['', Validators.required],
      extension: ['', Validators.required]
    });
  }

  private calculateStart(page: number, pageSize: number): number {
    return page ? page * pageSize : 0;
  }

  private loadConfigs() {
    const groups = this.configService.config.get('sortingConfig');
    Object.keys(groups).forEach(folderName => {
      this.tableGroups.push({
        name: folderName,
        extensions: groups[folderName]
      });
    });
  }

  private saveConfig() {
    const output = {};
    this.tableGroups.forEach(group => {
      output[group.name] = group.extensions;
    });
    this.configService.config.set('sortingConfig', output);
  }

  ngOnInit() {
    this.loadConfigs();
    this.dataSource = new MatTableDataSource(this.tableGroups);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }

  addExtension(folder: string, event: MatChipInputEvent) {
    let value = event.value.trim();
    if (value) {
      const groupIndex = this.tableGroups.findIndex(group => {
        return group.name === folder;
      });
      if (!value.startsWith('.', 0)) {
        value = `.${value}`;
      }
      this.tableGroups[groupIndex].extensions.push(value);
    }
    if (event.input) {
      event.input.value = '';
    }
    this.saveConfig();
  }

  addGroup() {
    if (this.newGroupForm.valid) {
      let value = this.newGroupForm.get('extension').value;
      if (!value.startsWith('.', 0)) {
        value = `.${value}`;
      }
      this.tableGroups.push({
        name: this.newGroupForm.get('name').value,
        extensions: [value]
      });
    }
    this.newGroupForm.reset();
    this.saveConfig();
    this.dataSource.data = this.tableGroups;
  }

  removeExtension(folder: string, extension: string) {
    const groupIndex = this.tableGroups.findIndex(group => {
      return group.name === folder;
    });
    if (this.tableGroups[groupIndex].extensions.length === 1) {
      this.tableGroups.splice(groupIndex, 1);
      this.dataSource.data = this.tableGroups;
    } else {
      const extensionIndex = this.tableGroups[groupIndex].extensions.findIndex(
        ext => {
          return ext === extension;
        }
      );
      this.tableGroups[groupIndex].extensions.splice(extensionIndex, 1);
    }
    this.saveConfig();
  }
}
