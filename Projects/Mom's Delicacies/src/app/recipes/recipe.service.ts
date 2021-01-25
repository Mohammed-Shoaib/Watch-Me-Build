import { Subject } from 'rxjs';
import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'The Perfect Steak',
  //     'Everyone loves steak but very few know how to cook the perfect steak',
  //     'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
  //     [
  //       new Ingredient('Rib-eye Steak', 4),
  //       new Ingredient('Kosher salt', 1),
  //       new Ingredient('Black pepper', 1),
  //       new Ingredient('Garlic cloves', 3)
  //     ]),
  //   new Recipe(
  //     'Gajar Ka Halwa',
  //     'Gajar ka halwa or carrot halwa is one of the most popular dessert recipes among all Indian recipes. It is made by freshly grated carrot, milk, sugar, khoya and dry fruits. Khoya gives creamy taste and texture to this halwa.',
  //     'https://live.staticflickr.com/5496/31479301445_cb53c0f4e9_b.jpg',
  //     [
  //       new Ingredient('Carrot', 10),
  //       new Ingredient('Cashew', 10),
  //       new Ingredient('Almonds', 10)
  //     ]),
  //   new Recipe(
  //     'Ramen',
  //     'Ramen with eggs, chilli, spices and an amazing sauce',
  //     'https://cache.desktopnexus.com/thumbseg/1661/1661425-bigthumbnail.jpg',
  //     [
  //       new Ingredient('Garlic cloves', 3),
  //       new Ingredient('Green onions', 3),
  //       new Ingredient('Eggs', 4)
  //     ])
  // ];
  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService) {}

  getRecipe(index: number) {
    return this.recipes[index];
  }

  getRecipes() {
    return this.recipes.slice();
  }
  
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}