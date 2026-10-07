from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path(__file__).resolve().parents[1]
with ZipFile(root/'green-village-ecology.zip','w',ZIP_DEFLATED) as z:
    for p in (root/'dist').rglob('*'):
        if p.is_file() and p.name not in ('village.png','vercel.json'): z.write(p,p.relative_to(root/'dist').as_posix())
print('Static deployment ZIP:',(root/'green-village-ecology.zip').stat().st_size,'bytes')
