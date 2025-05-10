import { Component, signal, viewChild } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchBarModule } from '../../components/search-bar/search-bar.module';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { ProfessionalCardComponent } from '../../components/professional-card/professional-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    ProfessionalCardComponent,
    SearchBarModule,
  ],
})
export class HomeComponent {
  searchResults = signal<string[]>([]);

  onFocused(): void {
    console.log('focused');
    this.searchResults.set(['Psi 1', 'Psi 2', 'Psi 3']);
  }

  onBlurred(): void {
    console.log('blurred');
    this.searchResults.set([]);
  }

  onValueChanged(value: string): void {
    console.log(value);
  }

  onItemClicked(item: string): void {
    console.log(item);
  }
}
