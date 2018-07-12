import { ObjectLengthPipe } from './../../pipes/objectlength.pipe';
import { AppComponent } from '../../app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ElectronService } from '../../providers/electron.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from '../../components/home/home.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { WebviewDirective } from '../../directives/webview.directive';
import '../../../polyfills';
import 'reflect-metadata';
import 'zone.js/dist/zone-mix';
import { MaterialModule } from '../material/material.module';
import { ConfigService } from '../../providers/config.service';
import { GroupsComponent } from '../../components/groups/groups.component';
import { OverlookedComponent } from '../../components/overlooked/overlooked.component';
import { SettingsComponent } from '../../components/settings/settings.component';
import { AngularOnboardingModule, Config } from 'angular-onboarding';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const angularOnboardingConfig: Config = {
  steps: []
};

@NgModule({
  declarations: [AppComponent, HomeComponent, GroupsComponent, OverlookedComponent, SettingsComponent,  WebviewDirective, ObjectLengthPipe],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MaterialModule,
    AngularOnboardingModule.forRoot(angularOnboardingConfig),
    ReactiveFormsModule
  ],
  providers: [ElectronService, ConfigService, ObjectLengthPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
