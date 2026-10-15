# Jennifer Muñoz · Sitio web profesional

Sitio de presentación de servicios desarrollado por **Isidora TI Studio**. Reúne información de sesiones, trayectoria, contacto por WhatsApp y un módulo de reseñas con moderación.

[Visitar sitio publicado](https://jenni.cl) · [Volver al portafolio](../..)

## Objetivo y trabajo realizado

Organizar la información del servicio y facilitar el recorrido desde la presentación hasta una consulta. El proyecto incluye una página adaptable a distintos tamaños de pantalla, navegación móvil, traducciones de contenido de la portada y formularios de reseñas.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| HTML5 | Estructura de la página principal |
| CSS3 | Diseño, componentes y adaptación a pantallas |
| JavaScript | Menú, animaciones de aparición, traducciones y preferencia de idioma |
| PHP | Recepción, publicación y moderación de reseñas |
| JSON | Almacenamiento local de reseñas |

No requiere un framework ni un proceso de compilación.

## Funciones

- Navegación por secciones y menú móvil.
- Contacto por WhatsApp mediante enlaces con mensaje preparado.
- Selector español, portugués e inglés para contenido de la portada; conserva la elección en el navegador. Las páginas de reseñas están en español.
- Animaciones al entrar elementos en pantalla.
- Envío de reseñas, con publicación posterior a aprobación.
- Panel de administración para aprobar, ocultar y eliminar reseñas.
- Tokens CSRF en el envío de reseñas y las acciones de moderación, campo señuelo y espera entre envíos por sesión.

## Ejecutar en local

Requisitos: **PHP 8 o posterior**, extensión **mbstring**, sesiones habilitadas y permiso de escritura para la carpeta `data/`. El panel usa un archivo de configuración local que no se publica.

Desde esta carpeta:

```bash
cp review-config.example.php review-config.php
```

Genera el hash SHA-256 de una contraseña propia. Por ejemplo, con PHP interactivo:

```bash
php -a
```

```php
echo hash('sha256', 'tu-contraseña-local');
```

En la misma terminal que ejecutará el servidor, asigna ese hash a la variable de entorno indicada. Sustituye el texto de ejemplo por los 64 caracteres hexadecimales generados:

```bash
export REVIEW_ADMIN_PASSWORD_HASH='HASH_GENERADO_LOCALMENTE'
php -S 127.0.0.1:8000
```

Abre `http://127.0.0.1:8000`. Las reseñas están en `/resenas.php` y el panel en `/administrar-resenas.php`. El servidor de PHP es para desarrollo local.

Para revisar solo la portada, también puedes abrir `index.html`; las páginas PHP requieren el servidor. Los tipos de letra se cargan desde Google Fonts.

## Estructura

```text
index.html                  Página principal
styles.css                  Estilos y adaptación de pantallas
script.js                   Interacciones y traducciones
resenas.php                 Formulario y reseñas aprobadas
administrar-resenas.php      Panel de moderación
review-config.example.php   Configuración de ejemplo sin secretos
assets/images/              Fotografías y recursos gráficos
```

Los archivos `review-config.php` y `data/resenas.json` se crean localmente y están excluidos mediante `.gitignore`. Las reseñas reales y la configuración del alojamiento no forman parte del repositorio.

## Comprobaciones y alcance

Al incorporar esta copia al portafolio se comprobó la sintaxis de JavaScript y la existencia de los recursos locales referenciados. El entorno de preparación no dispone de PHP: no se ejecutaron aquí los flujos de envío, acceso y moderación. Las funciones descritas se identificaron en el código; no equivalen a una certificación de funcionamiento o seguridad.

Esta es una copia para revisión del proyecto. Un despliegue público requiere revisar permisos, almacenamiento de datos y configuración del servidor. GitHub Pages no ejecuta PHP.

## Autoría y recursos

Desarrollo web: **Isidora TI Studio**. Fotografías, identidad visual y contenidos de Jennifer Muñoz pertenecen a sus respectivos titulares. Se incluyen para contextualizar el proyecto; no se concede una licencia de reutilización de esos recursos.
