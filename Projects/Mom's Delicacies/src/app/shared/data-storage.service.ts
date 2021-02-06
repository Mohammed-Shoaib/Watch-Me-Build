import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { AuthService } from './../auth/auth.service';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  url = 'https://recipe-and-shopping-f60c9-default-rtdb.firebaseio.com/recipes.json';
  
  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {}
  
  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
    .put(this.url, recipes)
    .subscribe(response => console.log(response));
  }
  
  fetchRecipes() {
    return this.http
      .get<Recipe[]>(this.url)
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe, 
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}