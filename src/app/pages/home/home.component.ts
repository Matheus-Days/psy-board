import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchBarModule } from '../../components/search-bar/search-bar.module';
import { ProfessionalCardComponent } from '../../components/professional-card/professional-card.component';
import { UserPublicData, UserService } from '../../services/user.service';

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
  ],
})
export class HomeComponent implements OnInit {
  userService = inject(UserService);

  private _results = signal<UserPublicData[]>([]);
  searchResults = computed(() =>
    this._results().filter(user => user.name !== 'Example')
  );

  ngOnInit(): void {
    this.userService.listUsers().then(users => {
      this._results.set(users);
    });
  }
}
