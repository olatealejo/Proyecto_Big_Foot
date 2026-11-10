# CRUD de Productos — The Big Foot

El catálogo público conserva inicialmente los tres modelos incluidos en el código. Firestore `productos/{sku}` sobrescribe sus datos y agrega modelos nuevos. Para retirar un modelo se escribe `activo:false` con motivo: no se borra físicamente, por lo que los modelos base no reaparecen.

## Activación
1. Instalar dependencias con `npm install` y ejecutar `npm run build` / `npm test`.
2. Copiar `.env.example` a `.env.local` y completar las seis variables VITE_FIREBASE_* del proyecto Firebase (no subir credenciales personales).
3. Activar Firebase Authentication (correo/contraseña; Google opcional) y Cloud Firestore.
4. **Publicar** las reglas de `firestore.rules` desde la consola Firebase o Firebase CLI. Subir el archivo a GitHub no las activa.
5. Registrar el administrador, obtener su UID en Firebase Authentication y **desde Firebase Console o una herramienta administrativa confiable**, cambiar `usuarios/{uid}.rol` a `admin`. Nunca asignar admin desde el navegador. Las reglas impiden que un usuario normal se otorgue ese rol.
6. Iniciar sesión y visitar `/productos`: los administradores verán Agregar, Editar, Retirar y Restaurar; el público solo verá el catálogo.
7. Para productos nuevos, usar URL HTTPS pública de la imagen. No se implementó la subida directa a Storage; el administrador debe alojar las imágenes.
8. Las bajas lógicas exigen justificación de 10 o más caracteres, siguiendo el criterio de moderación de Comunidad.

## Notas
- Sin .env.local, el catálogo se muestra en modo público sin edición ni sincronización.
- El precio y las imágenes se sincronizan también en la ficha de detalle y el carrito. Productos retirados dejan de estar disponibles.
- Se conserva localStorage solo para el carrito; las ediciones persisten en Firestore.
- La autorización real está en las reglas Firestore, no únicamente en los botones.
- No hay stock ni descuentos ni cobro conectado.
