import { ConfigService } from './../../providers/config.service';
import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  public theme: string;
  public delay: number;
  public otherName: string;

  constructor(
    private configService: ConfigService
  ) {
    this.theme = this.configService.config.get('theme');
    this.otherName = this.configService.config.get('othersName');
    this.delay = this.configService.config.get('sortingDelay') / 1000;
  }

  delayChange(newDelay: number) {
    this.delay = newDelay;
    this.configService.config.set('sortingDelay', this.delay * 1000);
  }

  themeChange(event: MatSelectChange) {
    this.theme = event.value;
    this.configService.config.set('theme', this.theme);
  }

  otherChange(newName: string) {
    this.otherName = newName;
    this.configService.config.set('othersName', this.otherName);
  }
}
