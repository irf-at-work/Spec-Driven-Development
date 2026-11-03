import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Workbook } from 'exceljs';
import { API_BASE_URL_VALUE } from '../core/app-config';
import { ApiProblemError } from '../core/api-problem';
import { IconButtonComponent } from '../shared/icon-button/icon-button.component';
import { NotificationService } from '../shared/notifications/notification.service';

type PreviewRow = { rowNumber: number; alreadyExists: boolean; errors: string[]; isValid: boolean; [key: string]: unknown };
const layouts = {
  vehicle: { title: 'Vehicle Makes', path: '/api/vehicle-makes/import', back: '/vehicle-makes', headers: ['MAKE_CODE','MAKE_NAME','SHORT_NAME','REMARKS','ARABIC_MAKE_NAME','ARABIC_SHORT_NAME','ARABIC_REMARKS','ACTIVE'],
    samples: [], keys: ['makeCode','makeName','shortName','remarks','arabicMakeName','arabicShortName','arabicRemarks','active'] },
  premium: { title: 'Premium Adjustments', path: '/api/premium-adjustments/import', back: '/premium-adjustments', headers: ['CODE_TYPE','CODE','COMPANY_CODE','NAME','SHORT_NAME','DISCOUNT_TYPE','CHARGES_TYPE','CHARGES_CATEGORY','REMARKS','ARABIC_NAME','ARABIC_SHORT_NAME','ARABIC_REMARKS','ACTIVE'],
    samples: [], keys: ['codeType','code','companyCode','name','shortName','discountType','chargesType','chargesCategory','remarks','arabicName','arabicShortName','arabicRemarks','active'] },
  model: { title: 'Vehicle Models', path: '', back: '', headers: ['MODEL_CODE','MODEL_NAME','SHORT_NAME','REMARKS','ARABIC_MODEL_NAME','ARABIC_SHORT_NAME','ARABIC_REMARKS','VARIANT','VEHICLE_TYPE','WEIGHT','LOAD_CAPACITY','BODY_TYPE','FUEL_TYPE','ENGINE_CAPACITY','CYLINDERS','SEATS','PASSENGERS','DRIVERS','DOORS','MAKE_YEAR','DRIVING_TYPE','BODY_COLOUR','VALUE','CATEGORY','ACTIVE'],
    samples: [], keys: ['modelCode','modelName','shortName','remarks','arabicModelName','arabicShortName','arabicRemarks','variant','vehicleType','weight','loadCapacity','bodyType','fuelType','engineCapacity','cylinders','seats','passengers','drivers','doors','makeYear','drivingType','bodyColour','value','category','active'] },
} as const;

@Component({
  selector: 'app-master-data-import',
  imports: [IconButtonComponent, MatButtonModule, MatProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './master-data-import.component.html',
  styleUrl: './master-data-import.component.css',
})
export class MasterDataImportComponent {
  private readonly http=inject(HttpClient); private readonly route=inject(ActivatedRoute); private readonly router=inject(Router); private readonly notify=inject(NotificationService);
  protected readonly layout = computed(()=>this.route.snapshot.data['kind']==='premium' ? layouts.premium : this.route.snapshot.data['kind']==='model' ? layouts.model : layouts.vehicle);
  protected readonly rows=signal<PreviewRow[]>([]); protected readonly busy=signal(false); protected readonly error=signal('');
  protected readonly fileName = signal('');
  protected readonly resultMessage = signal('');
  protected readonly newCount=computed(()=>this.rows().filter(x=>!x.alreadyExists&&x.isValid).length);
  protected readonly skippedCount=computed(()=>this.rows().filter(x=>x.alreadyExists&&x.isValid).length);
  protected readonly canImport=computed(()=>this.rows().length>0&&this.rows().every(x=>x.isValid)&&this.newCount()>0);
  protected currentMakeCode(): string { return this.route.snapshot.paramMap.get('makeCode') ?? ''; }
  protected back(){if(this.route.snapshot.data['kind']==='model')void this.router.navigate(['/vehicle-makes/view'],{state:{makeCode:this.route.snapshot.paramMap.get('makeCode')}});else void this.router.navigate([this.layout().back]);}
  private endpoint(){const l=this.layout();return l.path||`/api/vehicle-makes/${encodeURIComponent(this.route.snapshot.paramMap.get('makeCode')??'')}/models/import`;}
  protected async downloadTemplate(){const l=this.layout();const wb=new Workbook();const ws=wb.addWorksheet('IMPORT');ws.addRow(l.headers);for(const r of l.samples)ws.addRow([...r]);ws.getRow(1).font={bold:true};ws.views=[{state:'frozen',ySplit:1}];const bytes=await wb.xlsx.writeBuffer();const url=URL.createObjectURL(new Blob([bytes]));const a=document.createElement('a');a.href=url;a.download=`${l.title.toLowerCase().replaceAll(' ','-')}-template.xlsx`;a.click();URL.revokeObjectURL(url);}
  protected async selectFile(event:Event){const input=event.target as HTMLInputElement;const file=input.files?.[0];this.rows.set([]);this.error.set('');this.resultMessage.set('');this.fileName.set(file?.name??'');if(!file)return;if(file.size>5*1024*1024){this.error.set('Workbook must be 5 MB or smaller.');input.value='';return;}try{const wb=new Workbook();await wb.xlsx.load(await file.arrayBuffer());const ws=wb.getWorksheet('IMPORT');if(!ws)throw new Error('The workbook must contain an IMPORT sheet.');const headers=ws.getRow(1).values as (string|undefined)[];const positions=this.layout().headers.map(h=>headers.findIndex(x=>String(x??'').trim().toUpperCase()===h));if(positions.some(i=>i<1))throw new Error(`Required headers: ${this.layout().headers.join(', ')}.`);const rows:Record<string,string>[]=[];ws.eachRow((r,n)=>{if(n===1)return;const obj:Record<string,string>={};this.layout().keys.forEach((k,i)=>obj[k]=String(r.getCell(positions[i]).text??'').trim());if(Object.values(obj).some(Boolean))rows.push(obj);});if(rows.length>1000)throw new Error('Workbook can contain no more than 1,000 data rows.');if(!rows.length)throw new Error('Workbook contains no data rows.');this.parsedRows=rows;this.busy.set(true);this.http.post<any>(`${API_BASE_URL_VALUE}${this.endpoint()}/preview`,{rows}).subscribe({next:r=>{this.rows.set(r.rows??[]);this.error.set((r.errors??[]).join(' '));this.busy.set(false);},error:e=>{this.error.set(this.importErrorMessage(e, 'preview'));this.busy.set(false);}});}catch(e){this.error.set(e instanceof Error?e.message:'The workbook could not be read.');}finally{input.value='';}}
  protected keyText(row:PreviewRow){return this.layout().keys.slice(0, this.layout().title==='Vehicle Makes'?1:this.layout().title==='Vehicle Models'?1:3).map(k=>String(row[k]??'')).join(' / ');}
  protected rowName(row: PreviewRow): string { return String(row[this.layout().title === 'Vehicle Models' ? 'modelName' : this.layout().title === 'Vehicle Makes' ? 'makeName' : 'name'] ?? ''); }
  protected async importRows(){const ok=await this.notify.confirm({title:`Import ${this.newCount()} ${this.layout().title} rows?`,text:`${this.skippedCount()} existing keys will be skipped.`,confirmButtonText:'Import',cancelButtonText:'Cancel'});if(!ok)return;this.busy.set(true);this.http.post<any>(`${API_BASE_URL_VALUE}${this.endpoint()}`,{rows:this.uploadRows}).subscribe({next:r=>{this.busy.set(false);this.resultMessage.set(`${r.insertedCount} inserted; ${r.skippedExistingCount} existing rows skipped.`);this.rows.set([]);this.parsedRows=[];},error:e=>{this.busy.set(false);this.error.set(this.importErrorMessage(e, 'import'));}});}
  private importErrorMessage(error: unknown, action: 'preview' | 'import'): string {
    if (error instanceof ApiProblemError && error.problem.status === 404) {
      return 'The import API route was not found. Restart the API with the latest code, then try again.';
    }
    if (error instanceof ApiProblemError && error.problem.status === 0) {
      return 'The API could not be reached. Check that it is running, then try again.';
    }
    return action === 'preview'
      ? 'The workbook could not be checked by the API. Verify the API is running and try again.'
      : 'The import was not completed. Preview the workbook again before retrying.';
  }
  private get uploadRows():Record<string,string>[] { return this.parsedRows; }
  private parsedRows:Record<string,string>[]=[];
}

