import { TableGroup } from './../../../../interfaces';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import * as ElectronConfig from 'electron-config';
import { ConfigService } from '../../providers/config.service';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns = ['folder', 'extensions'];
  public dataSource: GroupsDataSource;

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.dataSource = new GroupsDataSource(this.configService.config);
  }
}

export class GroupsDataSource implements DataSource<TableGroup> {
  private groupsSubject = new BehaviorSubject<TableGroup[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private config: ElectronConfig) {}

  private sortGroups(groups: TableGroup[], direction = 'asc'): TableGroup[] {
    const tableGroups = groups;
    if (direction === 'asc') {
      tableGroups.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    } else {
      tableGroups.sort((a, b) => {
        if (a.name > b.name) {
          return -1;
        } else if (a.name < b.name) {
          return 1;
        }
        return 0;
      });
    }
    return tableGroups;
  }

  private calculateStart(page: number, pageSize: number): number {
    return page ? page * pageSize : 0;
  }

  connect(collectionViewer: CollectionViewer): Observable<TableGroup[]> {
    return this.groupsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.groupsSubject.complete();
    this.loadingSubject.complete();
  }

  loadGroups(filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10) {
    let tableGroups = [];
    const groups = this.config.get('sortingConfig');

    this.loadingSubject.next(true);
    Object.keys(groups).forEach(folderName => {
      tableGroups.push({
        name: folderName,
        extensions: groups[folderName]
      });
    });
    tableGroups = this.sortGroups(tableGroups, sortDirection);
    if (filter !== '') {
      tableGroups = tableGroups.filter(group =>
        group.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    tableGroups = tableGroups.slice(
      this.calculateStart(pageIndex, pageSize),
      pageSize
    );
    this.groupsSubject.next(tableGroups);
  }
}
