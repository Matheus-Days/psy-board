import { NgModule } from '@angular/core';
import { SearchBarComponent } from './search-bar.component';
import { SearchBarItemComponent } from './search-bar-item/search-bar-item.component';

@NgModule({
  imports: [SearchBarComponent, SearchBarItemComponent],
  exports: [SearchBarComponent, SearchBarItemComponent],
})
export class SearchBarModule {}
