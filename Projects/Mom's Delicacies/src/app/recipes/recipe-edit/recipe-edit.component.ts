import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  private initForm() {
    let newRecipe = new Recipe('', '', '', []);
    let newIngredients = new FormArray([]);

    if (this.editMode) {
      newRecipe = this.recipeService.getRecipe(this.id);
      if (newRecipe['ingredients']) {
        for (let ingredient of newRecipe.ingredients)
          newIngredients.push(new FormGroup({
            'name': new FormControl(ingredient.name, Validators.required),
            'amount': new FormControl(ingredient.amount, [
              Validators.required, 
              Validators.pattern(/^[1-9]+\d*$/)
            ])
          }));
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(newRecipe.name, Validators.required),
      'description': new FormControl(newRecipe.description, Validators.required),
      'imagePath': new FormControl(newRecipe.imagePath, Validators.required),
      'ingredients': newIngredients
    });
  }

  onSubmit() {
    /*const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']
    );*/
    if (this.editMode)
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    else
      this.recipeService.addRecipe(this.recipeForm.value);
    
    this.onCancel();
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }
  
  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients'))
    .push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [
        Validators.required, 
        Validators.pattern(/^[1-9]+\d*$/)
      ])
    }));
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
  
  // *ngFor="let ingredientCtrl of recipeForm.get('ingredients').controls; let i = index"
}
