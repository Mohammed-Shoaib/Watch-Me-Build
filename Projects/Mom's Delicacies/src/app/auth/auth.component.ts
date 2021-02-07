import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';

import { AuthResponseData, AuthService } from "./auth.service";
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
	isLoginMode = true;
	isLoading = false;
	error: string = null;
	private closeSubscription: Subscription;
	@ViewChild(PlaceHolderDirective, { static: false}) alertHost: PlaceHolderDirective;
	
	constructor(
		private authService: AuthService, 
		private router: Router, 
		private componentFactoryResolver: ComponentFactoryResolver
	) {}
	
	ngOnDestroy() {
		if (this.closeSubscription)
			this.closeSubscription.unsubscribe();
	}
	
	onSwitchMode() {
		this.isLoginMode = !this.isLoginMode;
	}
	
	onSubmit(form: NgForm) {
		if (!form.valid)
			return;
		
		const email = form.value.email;
		const password = form.value.password;
		
		let authObs: Observable<AuthResponseData>;
		
		this.isLoading = true;
		if (this.isLoginMode)
			authObs = this.authService.login(email, password);
		else
			authObs = this.authService.signup(email, password);
		
		authObs.subscribe(responseData => {
			console.log(responseData);
			this.isLoading = false;
			this.router.navigate(['/recipes']);
		}, errorMessage => {
			console.log(errorMessage);
			this.error = errorMessage;
			this.showErrorAlert(errorMessage);
			this.isLoading = false;
		});
		
		form.reset();
	}
	
	onHandleError() {
		this.error = null;
	}
	
	private showErrorAlert(message: string) {
		// const alertCmp = new AlertComponent(); <-- will not work
		const alertComponentFactory = 
		this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
		
		const hostViewContainerRef = this.alertHost.viewContainerRef;
		hostViewContainerRef.clear();
		
		const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);
		componentRef.instance.message = message;
		this.closeSubscription = componentRef.instance.close.subscribe(() => {
			this.closeSubscription.unsubscribe();
			hostViewContainerRef.clear();
		});
	}
	
}