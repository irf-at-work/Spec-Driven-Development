import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-listing-master-page',
  template: `
    <section aria-labelledby="listing-master-title">
      <p>Master data</p>
      <h1 id="listing-master-title">Listing Master</h1>
      <p>This workspace is ready for the Listing Master feature.</p>
    </section>
  `,
})
export class ListingMasterPage {}
