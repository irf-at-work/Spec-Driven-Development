import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedPresentationExample } from '../../shared-presentation-example';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedPresentationExample],
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {}
