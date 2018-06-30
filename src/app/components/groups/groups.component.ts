import { TableGroup } from './../../../../interfaces';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import * as ElectronConfig from 'electron-config';
import { ConfigService } from '../../providers/config.service';
import { MatPaginator, PageEvent, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private tableGroups: TableGroup[] = [];
  public dataSource: MatTableDataSource<TableGroup>;
  public displayedColumns = ['folder', 'extensions'];

  constructor(private configService: ConfigService) {}

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

  ngOnInit() {
    this.loadConfigs();
    this.dataSource = new MatTableDataSource(this.tableGroups);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }
}
