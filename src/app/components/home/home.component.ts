import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { MatSlideToggleChange } from '@angular/material';
import { ConfigService } from '../../providers/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public others: boolean;
  public sorting: boolean;
  public downloadsDirectory: string;

  private config;

  constructor(
    private electronService: ElectronService,
    private configService: ConfigService
  ) {
    this.config = configService.config;
  }

  ngOnInit() {
    this.others = this.config.get('others');
    this.sorting = this.config.get('enabled');
    this.downloadsDirectory = this.config.get('downloadsPath');
    this.electronService.ipcRenderer.on('directory-selected', (event, folder) => {
      this.downloadsDirectory = folder;
    });
  }

  enableChnage(event: MatSlideToggleChange) {
    console.log(event.checked);
    this.config.set('enabled', event.checked);
  }

  othersChange(event: MatSlideToggleChange) {
    this.config.set('others', event.checked);
  }

  openFolderPicker() {
    this.electronService.ipcRenderer.send('open-folder-dialog');
  }
}
