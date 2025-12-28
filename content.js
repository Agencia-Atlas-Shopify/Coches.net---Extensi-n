/**
 * Coches.net Super Precio Filter Extension
 * Añade un botón destacado para filtrar solo anuncios con Super Precio (priceRank=5)
 */

(function() {
  'use strict';

  // Configuración
  const PRICE_RANK_PARAM = 'priceRank';
  const SUPER_PRICE_VALUE = '5';
  const BUTTON_ID = 'super-precio-filter-btn';

  /**
   * Verifica si el filtro Super Precio está activo
   */
  function isSuperPriceActive() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(PRICE_RANK_PARAM) === SUPER_PRICE_VALUE;
  }

  /**
   * Genera la URL con el filtro Super Precio
   */
  function getSuperPriceUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set(PRICE_RANK_PARAM, SUPER_PRICE_VALUE);
    return url.toString();
  }

  /**
   * Genera la URL sin el filtro de precio
   */
  function getUrlWithoutPriceRank() {
    const url = new URL(window.location.href);
    url.searchParams.delete(PRICE_RANK_PARAM);
    return url.toString();
  }

  /**
   * Crea el botón de Super Precio
   */
  function createSuperPriceButton() {
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';

    const isActive = isSuperPriceActive();

    // Icono de estrella
    const starIcon = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="super-precio-icon">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    `;

    button.innerHTML = `${starIcon}<span>SÓLO Super Precio</span>`;
    button.className = isActive ? 'super-precio-btn active' : 'super-precio-btn';
    button.title = isActive ? 'Quitar filtro Super Precio' : 'Mostrar solo anuncios con Super Precio';

    button.addEventListener('click', function(e) {
      e.preventDefault();
      if (isActive) {
        window.location.href = getUrlWithoutPriceRank();
      } else {
        window.location.href = getSuperPriceUrl();
      }
    });

    return button;
  }

  /**
   * Inserta el botón en la página
   */
  function insertButton() {
    // Evitar duplicados
    if (document.getElementById(BUTTON_ID)) {
      return;
    }

    // Buscar el contenedor del grupo de precios
    const priceGroup = document.getElementById('priceGroup');

    if (priceGroup) {
      // Crear contenedor para el botón
      const container = document.createElement('div');
      container.className = 'super-precio-container';
      container.appendChild(createSuperPriceButton());

      // Insertar antes del grupo de precios
      priceGroup.parentNode.insertBefore(container, priceGroup);
    } else {
      // Si no encuentra el grupo de precios, buscar en la barra de filtros
      const filtersContainer = document.querySelector('.mt-FiltersGroupedByAccordion-group');
      if (filtersContainer) {
        const container = document.createElement('div');
        container.className = 'super-precio-container';
        container.appendChild(createSuperPriceButton());
        filtersContainer.parentNode.insertBefore(container, filtersContainer);
      }
    }
  }

  /**
   * Observa cambios en el DOM para reinyectar el botón si es necesario
   */
  function setupObserver() {
    const observer = new MutationObserver(function(mutations) {
      // Solo actuar si el botón no existe
      if (!document.getElementById(BUTTON_ID)) {
        insertButton();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Inicialización
   */
  function init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        insertButton();
        setupObserver();
      });
    } else {
      insertButton();
      setupObserver();
    }
  }

  // Ejecutar
  init();
})();
