import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
const electronconfig = window.require('electron-config');

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public config;

  constructor(private electronService: ElectronService) {
    this.config = new electronconfig();
  }
}
