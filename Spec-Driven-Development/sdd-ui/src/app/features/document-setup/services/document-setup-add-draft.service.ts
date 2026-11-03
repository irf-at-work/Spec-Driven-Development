import { Injectable, signal } from '@angular/core';
import { ApplicableModuleRecord } from '../../../api/generated/models/applicable-module-record';
import { ApplicableModuleWrite } from '../../../api/generated/models/applicable-module-write';
import { DocumentSetupRecord } from '../../../api/generated/models/document-setup-record';

export interface DocumentSetupAddFormDraft {
  docCode: string;
  docName: string;
  docDescription: string;
  docSetupFor: string;
  flex1: string;
  flex2: string;
  nameInArabic: string;
  descriptionInArabic: string;
  activeYn: boolean;
}

@Injectable({ providedIn: 'root' })
export class DocumentSetupAddDraftService {
  private readonly modulesState = signal<ApplicableModuleWrite[]>([]);
  private readonly savedModulesState = signal<ApplicableModuleRecord[]>([]);
  private readonly parentFormState = signal<DocumentSetupAddFormDraft | null>(null);
  private readonly parentRecordState = signal<DocumentSetupRecord | null>(null);
  private bypassParentGuard = false;

  readonly modules = this.modulesState.asReadonly();
  readonly savedModules = this.savedModulesState.asReadonly();
  readonly parentRecord = this.parentRecordState.asReadonly();

  parentForm(): DocumentSetupAddFormDraft | null {
    return this.parentFormState();
  }

  setParentForm(value: DocumentSetupAddFormDraft): void {
    this.parentFormState.set(value);
  }

  setParentRecord(record: DocumentSetupRecord): void {
    this.parentRecordState.set(record);
  }

  addModule(module: ApplicableModuleWrite): void {
    this.modulesState.update((modules) => [...modules, module]);
  }

  updateModule(index: number, module: ApplicableModuleWrite): void {
    this.modulesState.update((modules) => {
      if (index < 0 || index >= modules.length) {
        throw new RangeError(`Applicable Module draft index ${index} is out of range.`);
      }

      return modules.map((current, moduleIndex) => (moduleIndex === index ? module : current));
    });
  }

  addSavedModule(module: ApplicableModuleRecord): void {
    this.savedModulesState.update((modules) => [...modules, module]);
  }

  removeModule(index: number): void {
    this.modulesState.update((modules) =>
      modules.filter((_, moduleIndex) => moduleIndex !== index),
    );
  }

  removeFirstModule(): void {
    this.modulesState.update((modules) => modules.slice(1));
  }

  clear(): void {
    this.parentFormState.set(null);
    this.parentRecordState.set(null);
    this.modulesState.set([]);
    this.savedModulesState.set([]);
    this.bypassParentGuard = false;
  }

  allowParentNavigationOnce(): void {
    this.bypassParentGuard = true;
  }

  consumeParentNavigationBypass(): boolean {
    const bypass = this.bypassParentGuard;
    this.bypassParentGuard = false;
    return bypass;
  }
}
