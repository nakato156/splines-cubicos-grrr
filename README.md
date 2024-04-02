# Splines Cúbicos

## Run project
Primero se crea un entorno virtual
```bash
python -m venv env
```
Luego se activa el entorno virtual 
- Windows
```bash
env\Scripts\activate.bat
```
- Linux 
```bash
source env/bin/activate
```
Y se instala los paquetes de python
```bash
pip install -r requirements.txt
```
Finalmente se ejecuta el proyecto
```bash
python index.py
```

## Compilación de estilos
Para los estilos se usa [tailwindcss](https://tailwindcss.com/docs/) y [`pytailwindcss`](https://pypi.org/project/pytailwindcss/).  
Para compilar los estilos ya sea por que se cambiaron o se perdió el `index.css` se hace de la siguiente forma (tener el entorno virtual activado)

```bash
tailwindcss -i .\app\static\tailwind\input.css -o .\app\static\css\index.css --minify --watch
```

Parametros:
- `-i`: especifica el archivo de entrada de css
- `-o`: especifica el archivo de salida css con las clases de tailwind 
- `--minify`: minifica el archivo css para que ocupe menos
- `--watch`: se mantiene al tanto de cambios en los archivos `.js` y `.html`

