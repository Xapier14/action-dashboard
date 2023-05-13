import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss'],
})
export class AttachmentComponent implements OnInit {
  @Input() type: 'image' | 'video' = 'image';
  @Input() url: string = '';
  @Input() thumbnail: string = '';

  public activated: boolean = false;
  public hovered: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  activate(): void {
    this.activated = true;
    this.leave();
  }

  hover(): void {
    if (this.activated) return;
    this.hovered = true;
    console.log('hovered');
  }

  leave(): void {
    this.hovered = false;
    console.log('left');
  }
}
