import argparse, hashlib, json, pathlib, re, zipfile
p=argparse.ArgumentParser()
p.add_argument('--apk',required=True);p.add_argument('--badging',required=True);p.add_argument('--aab');p.add_argument('--dist',default='dist')
a=p.parse_args();root=pathlib.Path(a.dist)
expected={x.relative_to(root).as_posix():hashlib.sha256(x.read_bytes()).hexdigest() for x in root.rglob('*') if x.is_file() and x.name!='sw.js'}
badging=pathlib.Path(a.badging).read_text()
permissions=set(re.findall(r"^uses-permission(?:-sdk-\d+)?: name='([^']+)'",badging,re.M))
allowed={'android.permission.INTERNET','app.theceo.companysimulator.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION'}
if permissions-allowed:raise SystemExit('Unexpected APK permissions: '+str(sorted(permissions-allowed)))
if "targetSdkVersion:'36'" not in badging:raise SystemExit('Unexpected target API')
def audit(path,prefix):
    f=pathlib.Path(path)
    with zipfile.ZipFile(f) as z:
        names=z.namelist()
        if len(names)!=len(set(names)):raise SystemExit('Duplicate ZIP entries')
        actual={n[len(prefix):]:hashlib.sha256(z.read(n)).hexdigest() for n in names if n.startswith(prefix) and not n.endswith('/')}
        mismatch=[n for n,v in expected.items() if actual.get(n)!=v]
        # Capacitor injects bridge JS files and may add Cordova compatibility files.
        if mismatch or 'sw.js' in actual:raise SystemExit('Bundled asset mismatch or native SW: '+str(mismatch))
        libs=[n for n in names if n.endswith('.so')]
        if libs:raise SystemExit('Native libraries require separate ELF / 16KB alignment audit: '+str(libs))
        return {'path':f.name,'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'expectedAssetCount':len(expected),'nativeLibraries':libs}
out={'qaPermissions':sorted(permissions),'apk':audit(a.apk,'assets/public/')}
if a.aab:out['aab']=audit(a.aab,'base/assets/public/')
pathlib.Path('audit-output').mkdir(exist_ok=True);pathlib.Path('audit-output/native-package.json').write_text(json.dumps(out,indent=2))
print(json.dumps(out))
