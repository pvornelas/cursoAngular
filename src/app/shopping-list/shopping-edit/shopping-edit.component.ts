import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingridient.model';
import { ShoppingListService } from '../shopping-list.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    shoppingForm: FormGroup;
    editSubscription: Subscription;
    editMode = false;
    editedItemIndex: number;

    constructor(private slService: ShoppingListService) { }

    ngOnInit() {
        this.shoppingForm = new FormGroup({
            'name': new FormControl(null, Validators.required),
            'amount': new FormControl(null, Validators.required)
        });

        this.editSubscription = this.slService.startedEditing.subscribe(
            (index: number) => {
                this.editedItemIndex = index;
                this.editMode = true;
                let ingredient = this.slService.getIngredient(index);

                this.shoppingForm.patchValue({
                    name: ingredient.name,
                    amount: ingredient.amount
                });
            }
        );
    }

    onSubmitItem() {
        const newIngredient = new Ingredient(
            this.shoppingForm.value.name,
            this.shoppingForm.value.amount
        );

        if (this.editMode) {
            this.slService.updateIngredient(this.editedItemIndex, newIngredient);
            this.editMode = false;
        } else {
            this.slService.addIngredient(newIngredient);
        }
        this.shoppingForm.reset();
    }

    onDelete() {
        this.slService.deleteIngredient(this.editedItemIndex);
        this.onClear();
    }

    onClear() {
        this.editMode = false;
        this.shoppingForm.reset();
    }

    ngOnDestroy() {
        this.editSubscription.unsubscribe();
    }
}
