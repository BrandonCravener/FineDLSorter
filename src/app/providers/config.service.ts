import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import * as ElectronConfig from 'electron-config';
const electronconfig = window.require('electron-config');

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public config: ElectronConfig;

  constructor(private electronService: ElectronService) {
    this.config = new electronconfig();
  }
}
