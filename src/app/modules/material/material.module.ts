import { NgModule } from '@angular/core';
import { MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule } from '@angular/material';

const modules = [MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule];

@NgModule({
  imports: [modules],
  exports: [modules]
})
export class MaterialModule {}
