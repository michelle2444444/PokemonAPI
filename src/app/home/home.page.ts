import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  offset = 0;
  limit = 60;
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons(event?: any) {
    if (this.loading) return;
    this.loading = true;

    this.http
      .get<any>(`https://pokeapi.co/api/v2/pokemon?offset=${this.offset}&limit=${this.limit}`)
      .subscribe((res) => {
        this.pokemons = [...this.pokemons, ...res.results];
        this.offset += this.limit;
        this.loading = false;

        if (event) {
          event.target.complete();
        }

        // Desactiva scroll si ya no hay más Pokémon
        if (res.next === null && event) {
          event.target.disabled = true;
        }
      });
  }

  getImageUrl(index: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`;
  }

  search = '';
searchResult: any = null;

onSearchChange() {
  if (!this.search.trim()) {
    this.searchResult = null;
    return;
  }

  this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${this.search.toLowerCase()}`)
    .subscribe({
      next: (res) => this.searchResult = res,
      error: () => this.searchResult = null
    });
}

}
