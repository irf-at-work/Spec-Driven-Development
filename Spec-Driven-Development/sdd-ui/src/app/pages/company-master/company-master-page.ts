import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-company-master-page',
  template: `
    <section aria-labelledby="company-master-title">
      <p>Master data</p>
      <h1 id="company-master-title">Company Master</h1>
      <p>This workspace is ready for the Company Master feature.</p>
    </section>
  `,
})
export class CompanyMasterPage {}
