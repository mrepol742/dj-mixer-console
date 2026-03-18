import { Injectable, ComponentRef, Injector, ApplicationRef, ComponentFactoryResolver, Type } from '@angular/core';
import { DialogComponent } from '../../../shared/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogRef?: ComponentRef<DialogComponent>;

  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private cfr: ComponentFactoryResolver
  ) {}

  open<T>(component: Type<T>, data?: any) {
    if (this.dialogRef) return;

    const factory = this.cfr.resolveComponentFactory(DialogComponent);
    this.dialogRef = factory.create(this.injector);

    this.dialogRef.instance.childComponent = component;
    this.dialogRef.instance.data = data;
    this.dialogRef.instance.close.subscribe(() => this.close());

    this.appRef.attachView(this.dialogRef.hostView);
    document.body.appendChild((this.dialogRef.hostView as any).rootNodes[0]);
  }

  close() {
    if (!this.dialogRef) return;
    this.appRef.detachView(this.dialogRef.hostView);
    this.dialogRef.destroy();
    this.dialogRef = undefined;
  }
}
