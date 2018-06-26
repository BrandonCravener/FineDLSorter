import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ElectronService } from './providers/electron.service';
import { Router, RouterOutlet } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  stagger,
  query
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('backState', [
      state('true', style({ opacity: 0 })),
      state('false', style({ opacity: 1 })),
      transition('true => false', animate('200ms')),
      transition('false => true', animate('200ms'))
    ]),
    trigger('routerTransition', [
      transition('HomeComponent => *', [
        query(
          ':leave mat-card',
          stagger(150, [
            animate(150, style({ transform: 'translateY(-200%)' }))
          ])
        )
      ]),
      transition('* => HomeComponent', [
        query(':enter mat-card', [
          style({ transform: 'translateY(-200%)' }),
          stagger(150, [animate(150, style({ transform: 'translateY(0)' }))])
        ])
      ])
    ])
  ]
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
      this.home = router.url === '/';
    });
  }

  close() {
    this.electronService.remote.getCurrentWindow().close();
  }

  exit() {
    this.electronService.remote.app.quit();
  }

  getComponent(outlet: RouterOutlet) {
    if (outlet.isActivated) {
      return /^\s*function\s*([^\(]*)/i.exec(
        String(outlet.activatedRoute.component)
      )[1];
    }
  }
}
