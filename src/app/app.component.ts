import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ElectronService } from './providers/electron.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public theme = 'amber-theme';

  public home = true;

  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private router: Router
  ) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    router.events.subscribe(event => {
      this.home = (router.url === '/');
    });
  }

  close() {
    this.electronService.remote.getCurrentWindow().close();
  }

  exit() {
    this.electronService.remote.app.quit();
  }
}
