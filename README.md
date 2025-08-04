# Comparador de Subastas

Este proyecto es una plataforma web para comparar vehículos y gestionar subastas, diseñada para ofrecer una experiencia de usuario fluida y visualmente atractiva.

## Características

*   **Comparador de Vehículos**: Permite a los usuarios seleccionar y comparar hasta tres vehículos simultáneamente, mostrando sus características detalladas en tablas individuales y destacando las diferencias.
*   **Listado de Subastas**: Muestra una lista de subastas de vehículos activas y finalizadas con información relevante como el estado, la oferta actual, el tiempo restante y el historial de pujas.
*   **Funcionalidad de Puja**: Los usuarios pueden realizar pujas en tiempo real en las subastas activas, con notificaciones si su oferta es superada.
*   **Diseño Responsivo**: Adaptado para funcionar correctamente en diferentes tamaños de pantalla, desde dispositivos móviles hasta escritorios.
*   **Animaciones y Carga Diferida**: Implementa animaciones suaves con Framer Motion y carga diferida de imágenes para mejorar la experiencia y el rendimiento.

## Tecnologías Utilizadas

*   **Next.js**: Framework de React para aplicaciones web.
*   **React**: Biblioteca de JavaScript para construir interfaces de usuario.
*   **Tailwind CSS**: Framework CSS para un diseño rápido y personalizable.
*   **Shadcn/ui**: Componentes de UI reutilizables y accesibles.
*   **Framer Motion**: Librería para animaciones en React.
*   **date-fns**: Utilidad para el manejo de fechas.

## Configuración del Proyecto

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local:

### 1. Clonar el Repositorio

### 2. Instalar Dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Uso

*   **Comparador**: En la página principal, selecciona hasta tres vehículos para ver una comparación detallada de sus atributos. Puedes ocultar las similitudes para enfocarte en las diferencias clave.
*   **Subastas**: Navega a la sección de subastas para ver los vehículos disponibles. Puedes realizar pujas en las subastas activas y ver el historial de pujas.
