import { NgModule } from '@angular/core';
import { MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, MatSlideToggleModule, MatTooltipModule } from '@angular/material';

const modules = [MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, MatSlideToggleModule, MatTooltipModule];

@NgModule({
  imports: [modules],
  exports: [modules]
})
export class MaterialModule {}
