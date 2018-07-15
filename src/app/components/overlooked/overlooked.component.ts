import { TableClassification } from './../../../../interfaces';
import { ConfigService } from './../../providers/config.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-overlooked',
  templateUrl: './overlooked.component.html',
  styleUrls: ['./overlooked.component.scss']
})
export class OverlookedComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private tableClassifications: TableClassification[] = [];

  public newClassificationForm: FormGroup;
  public dataSource: MatTableDataSource<TableClassification>;
  public displayedColumns = ['label', 'classification'];

  constructor(
    private configService: ConfigService,
    private formbuilder: FormBuilder
  ) {
    this.newClassificationForm = formbuilder.group({
      label: ['', Validators.required],
      classification: ['', Validators.required]
    });
  }

  private calculateStart(page: number, pageSize: number): number {
    return page ? page * pageSize : 0;
  }

  private loadConfigs() {
    const classifications = this.configService.config.get('ignoredFiles');
    Object.keys(classifications).forEach(label => {
      this.tableClassifications.push({
        label: label,
        classification: classifications[label]
      });
    });
  }

  private saveConfig() {
    const output = {};
    this.tableClassifications.forEach(group => {
      output[group.label] = group.classification;
    });
    this.configService.config.set('ignoredFiles', output);
  }

  ngOnInit() {
    this.loadConfigs();
    this.dataSource = new MatTableDataSource(this.tableClassifications);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }

  addClassification() {
    if (this.newClassificationForm.valid) {
      this.tableClassifications.push({
        label: this.newClassificationForm.get('label').value,
        classification: this.newClassificationForm.get('classification').value
      });
    }
    this.newClassificationForm.reset();
    this.saveConfig();
    this.dataSource.data = this.tableClassifications;
  }
}
