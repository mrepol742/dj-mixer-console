import { AfterViewInit, Component, ComponentFactoryResolver, EventEmitter, Input, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent implements AfterViewInit {
  @Input() childComponent!: Type<any>;
  @Input() data: any;
  @Output() close = new EventEmitter<void>();
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

  constructor(private cfr: ComponentFactoryResolver) {}

  ngAfterViewInit() {
    if (!this.childComponent) return;
    const factory = this.cfr.resolveComponentFactory(this.childComponent);
    const componentRef = this.container.createComponent(factory);
    if (this.data) Object.assign(componentRef.instance, this.data);
  }

  onClose() {
    this.close.emit();
  }
}
