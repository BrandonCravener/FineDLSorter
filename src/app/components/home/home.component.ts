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

  public sorting: boolean;

  constructor(
    private electronService: ElectronService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    console.log(this.configService.config.path);
  }

  enableChnage(event: MatSlideToggleChange) {
    this.configService.config.set('enabled', event.checked);
  }

}
