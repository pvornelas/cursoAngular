import { Injectable, EventEmitter } from '@angular/core';
import { Recipe } from './recipes.model';
import { Ingredient } from '../shared/ingridient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {  
  private recipes: Recipe[] = [
    new Recipe(      
      'Bolo de brigadeiro',
      'Estupidamente brigadeirado',
      'https://guiadacozinha.com.br/wp-content/uploads/2017/03/bolo-brigadeiro-confeitado.jpg',
      [
        new Ingredient('Leite condensado', 2),
        new Ingredient('Chocolate', 3)
      ]),

    new Recipe(      
      'Hamburgão',
      'BolsoBurguer',
      'https://i.ytimg.com/vi/3ECN3tmzjjk/maxresdefault.jpg',
      [
        new Ingredient('Carne', 1),
        new Ingredient('Cheddar', 2),
        new Ingredient('Pão', 1)
      ])
  ];

  constructor(private slService: ShoppingListService) { }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
}
