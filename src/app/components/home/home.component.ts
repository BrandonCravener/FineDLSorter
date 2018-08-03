import * as ElectronConfig from 'electron-config';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material';
import { ConfigService } from '../../providers/config.service';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { IpcMessageEvent } from 'electron';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public others: boolean;
  public sorting: boolean;
  public config: ElectronConfig;
  public downloadsDirectory: string;

  @ViewChild('otherToggle') otherToggle: MatSlideToggle;
  @ViewChild('sortingToggle') sortingToggle: MatSlideToggle;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private electronService: ElectronService,
    private configService: ConfigService,
  ) {
    this.config = configService.config;
  }

  ngOnInit() {
    this.others = this.config.get('others');
    this.sorting = this.config.get('enabled');
    this.downloadsDirectory = this.config.get('downloadsPath');
    this.electronService.ipcRenderer.on(
      'directory-selected',
      (event, folder) => {
        this.downloadsDirectory = folder;
      }
    );
    this.electronService.ipcRenderer.on(
      'enable',
      (event: IpcMessageEvent, enabled) => {
        if (this.sortingToggle.checked !== enabled) {
          this.sortingToggle.toggle();
        }
        this.changeDetector.detectChanges();
      }
    );
    this.electronService.ipcRenderer.on(
      'other',
      (event: IpcMessageEvent, enabled) => {
        if (this.otherToggle.checked !== enabled) {
          this.otherToggle.toggle();
        }
        this.changeDetector.detectChanges();
      }
    );
  }

  enableChange(event: MatSlideToggleChange) {
    this.electronService.ipcRenderer.send('enable', event.checked);
  }

  othersChange(event: MatSlideToggleChange) {
    this.electronService.ipcRenderer.send('other', event.checked);
  }

  openFolderPicker() {
    this.electronService.ipcRenderer.send('open-folder-dialog');
  }

  getNumberOfExtensions(): number {
    const groups = this.config.get('sortingConfig');
    let extensions = 0;
    Object.keys(groups).forEach(folderName => {
      extensions += groups[folderName].length;
    });
    return extensions;
  }
}
