import { Component, OnInit } from '@angular/core';

import { Recipe } from '../recipes.model';

@Component({
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
    styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
    recipes: Recipe[] = [
        new Recipe('Bolo', 'Bolo de brigadeiro',
         'https://guiadacozinha.com.br/wp-content/uploads/2017/03/bolo-brigadeiro-confeitado.jpg')
    ];

    constructor() { }

    ngOnInit() {
    }
}
