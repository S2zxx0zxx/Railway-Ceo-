import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
const task=process.argv[2];if(!['assembleDebug','bundleRelease'].includes(task))throw Error('Unsupported Android build task');
const windows=process.platform==='win32';
const result=spawnSync(windows?'gradlew.bat':'./gradlew',[task,'--no-daemon'],{cwd:resolve('android'),stdio:'inherit',shell:windows});
if(result.status!==0)throw Error('Gradle build failed: '+task);
