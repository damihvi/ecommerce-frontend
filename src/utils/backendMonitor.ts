// Backend status utilities
export interface BackendStatus {
  isOnline: boolean;
  message: string;
  lastChecked: Date;
  endpoints: {
    health: boolean;
    products: boolean;
    categories: boolean;
    users: boolean;
    search: boolean;
  };
}

export class BackendMonitor {
  private static instance: BackendMonitor;
  private status: BackendStatus;
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.status = {
      isOnline: false,
      message: 'Checking...',
      lastChecked: new Date(),
      endpoints: {
        health: false,
        products: false,
        categories: false,
        users: false,
        search: false,
      }
    };
  }

  static getInstance(): BackendMonitor {
    if (!BackendMonitor.instance) {
      BackendMonitor.instance = new BackendMonitor();
    }
    return BackendMonitor.instance;
  }

  async checkStatus(apiBaseUrl: string): Promise<BackendStatus> {
    const endpoints = [
      { name: 'health', url: '/' },
      { name: 'products', url: '/products' },
      { name: 'categories', url: '/categories' },
      { name: 'users', url: '/users' },
      { name: 'search', url: '/search/stats' },
    ];

    const results: any = {};

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${apiBaseUrl}${endpoint.url}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        results[endpoint.name] = response.ok;
      } catch (error) {
        results[endpoint.name] = false;
      }
    }

    // Update status
    const onlineEndpoints = Object.values(results).filter(Boolean).length;
    const totalEndpoints = endpoints.length;
    
    this.status = {
      isOnline: onlineEndpoints > 0,
      message: this.generateStatusMessage(onlineEndpoints, totalEndpoints, results),
      lastChecked: new Date(),
      endpoints: results,
    };

    return this.status;
  }

  private generateStatusMessage(online: number, total: number, endpoints: any): string {
    if (online === 0) {
      return '❌ Backend desconectado';
    } else if (online === total) {
      return '✅ Backend conectado exitosamente';
    } else if (endpoints.health && endpoints.categories) {
      return '⚠️ Backend parcialmente disponible';
    } else {
      return `⚠️ ${online}/${total} servicios disponibles`;
    }
  }

  getStatus(): BackendStatus {
    return this.status;
  }

  startPeriodicCheck(apiBaseUrl: string, intervalMs: number = 30000) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.checkStatus(apiBaseUrl);
    }, intervalMs);
  }

  stopPeriodicCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// Utility functions for React components
export const useBackendStatus = (apiBaseUrl: string) => {
  const monitor = BackendMonitor.getInstance();
  
  return {
    checkStatus: () => monitor.checkStatus(apiBaseUrl),
    getStatus: () => monitor.getStatus(),
    startMonitoring: (interval?: number) => monitor.startPeriodicCheck(apiBaseUrl, interval),
    stopMonitoring: () => monitor.stopPeriodicCheck(),
  };
};

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    switch (error.response.status) {
      case 500:
        return 'Error interno del servidor. El backend puede estar iniciando.';
      case 503:
        return 'Servicio no disponible. Render puede estar activando el servidor.';
      case 404:
        return 'Endpoint no encontrado.';
      case 401:
        return 'No autorizado. Verifica tu sesión.';
      case 403:
        return 'Acceso denegado.';
      default:
        return `Error del servidor: ${error.response.status}`;
    }
  } else if (error.request) {
    // Request was made but no response received
    return 'Sin respuesta del servidor. Verifica tu conexión.';
  } else {
    // Something else happened
    return `Error: ${error.message}`;
  }
};

export default BackendMonitor;
