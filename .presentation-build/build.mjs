import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile } from 'file:///C:/Program%20Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1030-493-0_26.1030.493.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const root = 'D:/tintz/Spec-Driven-Development';
const skill = 'C:/Users/ABSPC172/.codex/plugins/cache/openai-primary-runtime/presentations/26.1030.10813/skills/Presentations';
const draftDir = path.join(root, '.presentation-build');
const output = path.join(root, 'deliverables', 'Broker-Insurance-Master-Data-Progress.pptx');
const W = 1280, H = 720;
const C = { ink:'#10233F', navy:'#0B1F35', teal:'#0D7B78', aqua:'#D8F1EC', orange:'#E89B48', paper:'#F7F6F1', white:'#FFFFFF', muted:'#53657A', pale:'#E8EDF1', red:'#A94E44', green:'#237766' };
const p = Presentation.create({slideSize:{width:W,height:H}});
function box(slide, geometry, x,y,w,h,fill='none',stroke='none',strokeWidth=0,name='') {
  return slide.shapes.add({geometry,name,position:{left:x,top:y,width:w,height:h},fill,line:{style:'solid',fill:stroke,width:strokeWidth}});
}
function text(slide, value, x,y,w,h,size=22,color=C.ink,bold=false,name='') {
  const s=box(slide,'textbox',x,y,w,h,'none','none',0,name); s.text=value;
  s.text.style={fontFamily:'Aptos',fontSize:size,color,bold,verticalAlignment:'middle',wrap:true}; return s;
}
function base(title,kicker,n) {
  const s=p.slides.add(); s.background.fill=C.paper; box(s,'rect',0,0,14,H,C.teal);
  text(s,kicker.toUpperCase(),72,38,900,26,14,C.teal,true);
  text(s,title,72,78,1136,58,38,C.ink,true); box(s,'rect',72,150,1136,2,C.pale);
  text(s,'BROKER INSURANCE MASTER DATA',72,676,650,20,12,C.muted,true); text(s,String(n).padStart(2,'0'),1150,674,58,24,14,C.teal,true); return s;
}
function bullet(s,title,body,x,y,w,color=C.teal) {
  box(s,'rect',x,y+7,8,8,color); text(s,title,x+22,y,w-22,30,21,C.ink,true); text(s,body,x+22,y+34,w-28,58,17,C.muted,false);
}
{
 const s=p.slides.add(); s.background.fill=C.navy; box(s,'rect',0,0,18,H,C.teal);
 text(s,'PROJECT UPDATE  /  NOVEMBER 2026',76,66,650,28,16,'#91D5C8',true);
 text(s,'Broker Insurance\nMaster Data',76,154,760,170,52,C.white,true);
 text(s,'What we achieved, why it matters, and what remains',80,346,760,58,24,'#D5DFE8');
 box(s,'rect',80,454,300,2,'#35516A'); text(s,'~90%',80,492,250,90,58,C.white,true);
 text(s,'team estimate of project progress',82,585,400,34,18,'#B6C7D5');
 box(s,'rect',914,122,286,474,'#15334D'); text(s,'IN SCOPE',950,158,210,26,14,'#91D5C8',true);
 text(s,'Vehicle makes\n& models',950,220,220,90,26,C.white,true); box(s,'rect',950,334,210,2,'#35516A');
 text(s,'Premium\nadjustment codes',950,372,220,90,26,C.white,true);
 text(s,'Progress snapshot based on repository specs, implementation notes, and recorded validation checkpoints.',950,510,216,62,14,'#B6C7D5');
}
{
 const s=base('Why this work matters','The business need',2);
 text(s,'Brokers need master records they can find, trust, and maintain consistently.',72,184,1030,64,29,C.ink,true);
 bullet(s,'Reliable reference data','Makes, models, and adjustment codes feed downstream insurance workflows.',84,290,510);
 bullet(s,'Fewer avoidable data errors','Server-side rules enforce keys, required fields, valid options, and normalization.',672,290,510);
 bullet(s,'Controlled change','Inactive records can be restored; permanent deletion requires confirmation and safeguards.',84,438,510);
 bullet(s,'Usable for bilingual work','English and Arabic fields are supported, with right-to-left Arabic entry.',672,438,510);
 text(s,'The project turns scattered maintenance rules into one governed workflow.',84,592,1030,34,20,C.teal,true);
}
{
 const s=base('What is working today','Delivered capabilities',3);
 text(s,'Two master-data journeys share the same interaction and validation patterns.',72,180,1100,42,23,C.ink,true);
 box(s,'rect',72,254,532,300,C.white,'#DCE3E8',1); text(s,'01  VEHICLE MASTER',100,278,420,28,14,C.teal,true);
 text(s,'Makes and models',100,322,450,42,28,C.ink,true);
 text(s,'• Find, filter, sort, and page through makes\n• Add, open, update, retire, and safely delete\n• Manage models under a saved make\n• Import makes and model lookups from Excel',100,388,450,144,19,C.muted);
 box(s,'rect',636,254,572,300,C.white,'#DCE3E8',1); text(s,'02  PREMIUM ADJUSTMENTS',664,278,470,28,14,C.teal,true);
 text(s,'Adjustment-code master',664,322,480,42,28,C.ink,true);
 text(s,'• Create, view, edit, retire, restore, and delete\n• Validate code type and classification options\n• Filter each data column and page results\n• Keep key fields fixed while editing',664,388,492,144,19,C.muted);
 text(s,'Shared UI: accessible icon actions • breadcrumbs • unsaved-change prompts • English and Arabic typography',84,594,1125,34,17,C.teal,true);
}
{
 const s=base('How the system works','Implementation flow',4);
 text(s,'Requirements are written first; the API enforces the rules before data reaches Oracle.',72,180,1120,52,23,C.ink,true);
 const nodes=[['01','SPECIFICATION','User outcomes and acceptance rules'],['02','ASP.NET API','Validation, filtering, paging, audit'],['03','ORACLE 19c','Existing approved master-data schema'],['04','ANGULAR UI','Broker forms, lists, imports']];
 const xs=[72,362,652,942];
 for(let i=0;i<nodes.length;i++){const [n,h,b]=nodes[i];box(s,'rect',xs[i],298,250,196,i===0?C.aqua:C.white,'#DCE3E8',1);text(s,n,xs[i]+20,316,56,32,16,C.teal,true);text(s,h,xs[i]+20,360,210,28,16,C.ink,true);text(s,b,xs[i]+20,406,210,64,17,C.muted);if(i<3)box(s,'rect',xs[i]+258,391,28,3,C.orange);}
 text(s,'Automated checks cover API rules, Angular behavior, and end-to-end user journeys.',84,548,1100,36,20,C.ink,true);
 text(s,'Final integration acceptance still needs an approved Oracle test connection and loaded lookup fixtures.',84,594,1100,32,17,C.red);
}
{
 const s=base('Evidence from recorded checkpoints','Validation completed',5);
 text(s,'Feature 002 — Premium Adjustments  /  02 Nov 2026',72,184,1080,30,18,C.teal,true);
 text(s,'25',84,238,145,66,42,C.ink,true);text(s,'Angular tests passed',84,306,225,28,17,C.muted);
 text(s,'11',372,238,145,66,42,C.ink,true);text(s,'Playwright flows passed',372,306,245,28,17,C.muted);
 text(s,'24',670,238,145,66,42,C.ink,true);text(s,'focused API unit tests passed',670,306,260,28,17,C.muted);
 text(s,'✓',1000,238,72,66,42,C.green,true);text(s,'lint, build, format/analyzer checks recorded as passing',1000,306,210,62,16,C.muted);
 box(s,'rect',72,402,1136,2,C.pale);text(s,'Feature 001 — Vehicle Makes & Models  /  30 Oct 2026',72,430,1080,30,18,C.teal,true);
 text(s,'86 API tests passed',84,485,310,34,23,C.ink,true);text(s,'11 Angular unit tests passed',445,485,350,34,23,C.ink,true);
 text(s,'Angular lint and production build passed',84,536,565,34,19,C.muted);
 text(s,'These are dated checkpoints, not one current full-project run. The final runner has not completed.',84,600,1100,30,17,C.red,true);
}
{
 const s=base('What remains before we call it complete','Open gates',6);
 bullet(s,'Run full acceptance against approved Oracle test access','The recorded full runner stopped because SDD_TEST_ORACLE_CONNECTION was unavailable.',84,194,1050,C.red);
 bullet(s,'Load vehicle-model lookup fixtures','Nine fixed dropdown lists are needed to verify model entry and selection behavior.',84,304,1050,C.orange);
 bullet(s,'Resolve Arabic storage length','Oracle columns use BYTE semantics; maximum 100/30/2000-character Arabic values are not yet guaranteed to persist.',84,414,1050,C.red);
 bullet(s,'Close feature 001 sign-off','Run the full suite and walkthrough after access and fixtures; task documentation still has open close-out items.',84,524,1050,C.orange);
 text(s,'No schema change or write-side acceptance is claimed as complete.',84,632,1100,28,17,C.muted,true);
}
{
 const s=base('The final mile','Recommended sequence',7);
 const steps=[['1','Confirm approved test access','Provide the Oracle test connection through the secure local environment.'],['2','Load approved lookup data','Use the vehicle lookup import workflow; verify dropdowns with real fixtures.'],['3','Run and record acceptance','Execute test-all.ps1, then walk through both quickstart checklists.'],['4','Approve storage resolution','Choose and authorize a schema approach for Arabic character limits; then verify persistence.']];
 let y=190; for(const [n,h,b] of steps){box(s,'ellipse',82,y,48,48,C.teal);text(s,n,82,y+2,48,42,20,C.white,true);text(s,h,158,y-2,970,32,22,C.ink,true);text(s,b,158,y+34,990,42,17,C.muted);y+=108;}
 box(s,'rect',72,622,1136,2,C.pale);text(s,'Completion claim after the gates close: verified features, reproducible evidence, and documented remaining limits.',84,640,1080,24,16,C.teal,true);
}

await fs.mkdir(path.dirname(output),{recursive:true});
const draft=path.join(draftDir,'draft.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
for (const [i,slide] of p.slides.items.entries()) {
  const blob=await p.export({slide,format:'png',scale:1});
  await fs.writeFile(path.join(draftDir,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await blob.arrayBuffer()));
}
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const requirements={explicitTotalSlideCount:7,requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[]};
const result=await finalizePresentation({...requirements,workspaceDir:root,candidatePath:draft,finalPath:output,pythonExecutable:'C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1030-493-0_26.1030.493.0_x64__3k8sg7r9htsxt/dependencies/python/python.exe',integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],fontPolicy:{basis:'design',families:['Aptos']},verifyArtifactToolImport:true,receiptPath:path.join(draftDir,'validation.json')});
console.log(JSON.stringify({output,result}));
