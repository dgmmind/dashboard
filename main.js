/**
 * Dashboard Minimalista - JavaScript
 * Maneja toda la interactividad de la interfaz
 */


class DashboardManager {
    constructor() {
        this.init()
    }

    /**
     * Inicializa todos los componentes del dashboard
     */
    init() {
        this.initLucideIcons()
        this.initThemeToggle()
        this.initSidebar()
        this.initNavigation()
        this.initSlidePanels()
        this.initSearch()
        this.bindEvents()
    }

    /**
     * Inicializa los iconos de Lucide
     */
    initLucideIcons() {
        if (typeof lucide !== "undefined") {
            lucide.createIcons()
        }
    }

    /**
     * Inicializa el toggle de tema (dark/light mode)
     */
    initThemeToggle() {
        this.themeToggle = document.getElementById("themeToggle")
        this.themeIcon = this.themeToggle.querySelector(".dgm-theme-icon")

        // Cargar tema guardado o usar light mode por defecto
        const savedTheme = localStorage.getItem("dgm-theme") || "light"
        this.setTheme(savedTheme)

        this.themeToggle.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme") || "light"
            const newTheme = currentTheme === "light" ? "dark" : "light"
            this.setTheme(newTheme)
        })
    }

    /**
     * Establece el tema de la aplicación
     * @param {string} theme - 'light' o 'dark'
     */
    setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem("dgm-theme", theme)

        // Actualizar icono del tema
        if (this.themeIcon) {
            this.themeIcon.setAttribute("data-lucide", theme === "light" ? "moon" : "sun")
            if (typeof lucide !== "undefined") {
                lucide.createIcons()
            }
        }
    }

    /**
     * Inicializa la funcionalidad del sidebar
     */
    initSidebar() {
        this.sidebar = document.getElementById("sidebar")
        this.hamburgerBtn = document.getElementById("hamburgerBtn")
        this.backdrop = document.getElementById("backdrop")
        this.mainContent = document.getElementById("mainContent")

        // Toggle sidebar en mobile
        this.hamburgerBtn.addEventListener("click", () => {
            this.toggleSidebar()
        })

        // Cerrar sidebar al hacer click en el backdrop
        this.backdrop.addEventListener("click", () => {
            this.closeSidebar()
            this.closeAllPanels()
        })
    }

    /**
     * Toggle del sidebar
     */
    toggleSidebar() {
        const isActive = this.sidebar.classList.contains("dgm-active")

        if (isActive) {
            this.closeSidebar()
        } else {
            this.openSidebar()
        }
    }

    /**
     * Abre el sidebar
     */
    openSidebar() {
        this.sidebar.classList.add("dgm-active")
        this.backdrop.classList.add("dgm-active")
        document.body.style.overflow = "hidden"
    }

    /**
     * Cierra el sidebar
     */
    closeSidebar() {
        this.sidebar.classList.remove("dgm-active")
        this.backdrop.classList.remove("dgm-active")
        document.body.style.overflow = ""
    }

    /**
     * Inicializa la navegación expandible
     */
    initNavigation() {
        const navToggles = document.querySelectorAll(".dgm-nav-toggle")

        navToggles.forEach((toggle) => {
            toggle.addEventListener("click", (e) => {
                e.preventDefault()
                this.toggleNavItem(toggle)
            })
        })

        // Manejar clicks en enlaces de navegación
        const navLinks = document.querySelectorAll(".dgm-nav-link:not(.dgm-nav-toggle)")
        navLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault()
                this.setActiveNavItem(link)

                // Cerrar sidebar en mobile después de seleccionar
                if (window.innerWidth <= 768) {
                    this.closeSidebar()
                }
            })
        })
    }

    /**
     * Toggle de elementos de navegación expandibles
     * @param {HTMLElement} toggle - Elemento toggle
     */
    toggleNavItem(toggle) {
        const targetId = toggle.getAttribute("data-target")
        const submenu = document.getElementById(targetId)

        if (!submenu) return

        const isExpanded = toggle.classList.contains("dgm-expanded")

        // Cerrar todos los otros submenús
        document.querySelectorAll(".dgm-nav-toggle").forEach((otherToggle) => {
            if (otherToggle !== toggle) {
                otherToggle.classList.remove("dgm-expanded")
                const otherTargetId = otherToggle.getAttribute("data-target")
                const otherSubmenu = document.getElementById(otherTargetId)
                if (otherSubmenu) {
                    otherSubmenu.classList.remove("dgm-expanded")
                }
            }
        })

        // Toggle el elemento actual
        if (isExpanded) {
            toggle.classList.remove("dgm-expanded")
            submenu.classList.remove("dgm-expanded")
        } else {
            toggle.classList.add("dgm-expanded")
            submenu.classList.add("dgm-expanded")
        }
    }

    /**
     * Establece el elemento de navegación activo
     * @param {HTMLElement} activeLink - Enlace activo
     */
    setActiveNavItem(activeLink) {
        // Remover clase active de todos los enlaces
        document.querySelectorAll(".dgm-nav-link").forEach((link) => {
            link.classList.remove("dgm-active")
        })

        // Agregar clase active al enlace seleccionado
        activeLink.classList.add("dgm-active")
    }

    /**
     * Inicializa los paneles deslizantes
     */
    initSlidePanels() {
        // Panel de notificaciones
        this.notificationBtn = document.getElementById("notificationBtn")
        this.notificationPanel = document.getElementById("notificationPanel")
        this.closeNotificationPanel = document.getElementById("closeNotificationPanel")

        // Panel de perfil
        this.profileBtn = document.getElementById("profileBtn")
        this.profilePanel = document.getElementById("profilePanel")
        this.closeProfilePanel = document.getElementById("closeProfilePanel")

        // Event listeners para abrir paneles
        this.notificationBtn.addEventListener("click", () => {
            this.togglePanel(this.notificationPanel)
        })

        this.profileBtn.addEventListener("click", () => {
            this.togglePanel(this.profilePanel)
        })

        // Event listeners para cerrar paneles
        this.closeNotificationPanel.addEventListener("click", () => {
            this.closePanel(this.notificationPanel)
        })

        this.closeProfilePanel.addEventListener("click", () => {
            this.closePanel(this.profilePanel)
        })
    }

    /**
     * Toggle de panel deslizante
     * @param {HTMLElement} panel - Panel a mostrar/ocultar
     */
    togglePanel(panel) {
        const isActive = panel.classList.contains("dgm-active")

        // Cerrar todos los paneles primero
        this.closeAllPanels()

        if (!isActive) {
            this.openPanel(panel)
        }
    }

    /**
     * Abre un panel deslizante
     * @param {HTMLElement} panel - Panel a abrir
     */
    openPanel(panel) {
        panel.classList.add("dgm-active")
        this.backdrop.classList.add("dgm-active")
        document.body.style.overflow = "hidden"
    }

    /**
     * Cierra un panel deslizante
     * @param {HTMLElement} panel - Panel a cerrar
     */
    closePanel(panel) {
        panel.classList.remove("dgm-active")

        // Si no hay otros paneles abiertos, cerrar backdrop
        const activePanels = document.querySelectorAll(".dgm-slide-panel.dgm-active")
        if (activePanels.length === 0) {
            this.backdrop.classList.remove("dgm-active")
            document.body.style.overflow = ""
        }
    }

    /**
     * Cierra todos los paneles deslizantes
     */
    closeAllPanels() {
        const panels = document.querySelectorAll(".dgm-slide-panel")
        panels.forEach((panel) => {
            panel.classList.remove("dgm-active")
        })

        this.backdrop.classList.remove("dgm-active")
        document.body.style.overflow = ""
    }

    /**
     * Inicializa la funcionalidad de búsqueda
     */
    initSearch() {
        this.searchInput = document.querySelector(".dgm-search-input")

        if (this.searchInput) {
            this.searchInput.addEventListener("input", (e) => {
                this.handleSearch(e.target.value)
            })

            this.searchInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    this.handleSearchSubmit(e.target.value)
                }
            })
        }
    }

    /**
     * Maneja la búsqueda en tiempo real
     * @param {string} query - Término de búsqueda
     */
    handleSearch(query) {
        // Implementar lógica de búsqueda aquí
        console.log("Buscando:", query)

        // Ejemplo: filtrar elementos de navegación
        if (query.length > 0) {
            this.filterNavigation(query)
        } else {
            this.clearNavigationFilter()
        }
    }

    /**
     * Maneja el envío de búsqueda
     * @param {string} query - Término de búsqueda
     */
    handleSearchSubmit(query) {
        console.log("Búsqueda enviada:", query)
        // Implementar lógica de búsqueda completa aquí
    }

    /**
     * Filtra la navegación basada en la búsqueda
     * @param {string} query - Término de búsqueda
     */
    filterNavigation(query) {
        const navItems = document.querySelectorAll(".dgm-nav-item")
        const searchTerm = query.toLowerCase()

        navItems.forEach((item) => {
            const text = item.textContent.toLowerCase()
            const shouldShow = text.includes(searchTerm)

            item.style.display = shouldShow ? "block" : "none"
        })
    }

    /**
     * Limpia el filtro de navegación
     */
    clearNavigationFilter() {
        const navItems = document.querySelectorAll(".dgm-nav-item")
        navItems.forEach((item) => {
            item.style.display = "block"
        })
    }

    /**
     * Vincula eventos globales
     */
    bindEvents() {
        // Cerrar paneles con tecla Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.closeAllPanels()
                this.closeSidebar()
            }
        })

        // Manejar cambios de tamaño de ventana
        window.addEventListener("resize", () => {
            this.handleResize()
        })

        // Prevenir scroll del body cuando hay modales abiertos
        document.addEventListener(
            "touchmove",
            (e) => {
                if (document.body.style.overflow === "hidden") {
                    e.preventDefault()
                }
            },
            { passive: false },
        )
    }

    /**
     * Maneja cambios de tamaño de ventana
     */
    handleResize() {
        // Cerrar sidebar en desktop si está abierto
        if (window.innerWidth > 768) {
            this.closeSidebar()
        }

        // Ajustar paneles en mobile
        if (window.innerWidth <= 480) {
            const panels = document.querySelectorAll(".dgm-slide-panel")
            panels.forEach((panel) => {
                panel.style.width = "100vw"
            })
        }
    }
}

/**
 * Utilidades adicionales
 */
class DashboardUtils {
    /**
     * Formatea fechas de manera amigable
     * @param {Date} date - Fecha a formatear
     * @returns {string} Fecha formateada
     */
    static formatDate(date) {
        const now = new Date()
        const diff = now - date
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return "Ahora mismo"
        if (minutes < 60) return `Hace ${minutes} min`
        if (hours < 24) return `Hace ${hours} hora${hours > 1 ? "s" : ""}`
        if (days < 7) return `Hace ${days} día${days > 1 ? "s" : ""}`

        return date.toLocaleDateString()
    }

    /**
     * Debounce para optimizar búsquedas
     * @param {Function} func - Función a ejecutar
     * @param {number} wait - Tiempo de espera en ms
     * @returns {Function} Función debounced
     */
    static debounce(func, wait) {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    }

    /**
     * Genera un ID único
     * @returns {string} ID único
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2)
    }
}

// Inicializar el dashboard cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    window.dashboardManager = new DashboardManager()

    // Hacer disponibles las utilidades globalmente
    window.DashboardUtils = DashboardUtils

    console.log("Dashboard Minimalista inicializado correctamente")
})

// Manejar errores globales
window.addEventListener("error", (e) => {
    console.error("Error en Dashboard:", e.error)
})

// Exportar para uso en módulos si es necesario
if (typeof module !== "undefined" && module.exports) {
    module.exports = { DashboardManager, DashboardUtils }
}
