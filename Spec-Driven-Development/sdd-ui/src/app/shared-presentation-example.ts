import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-shared-presentation-example',
  templateUrl: './shared-presentation-example.html',
})
export class SharedPresentationExample {}
