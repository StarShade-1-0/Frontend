import API_CONFIG from './api-config';

/**
 * Test the backend API health endpoint
 * @returns Promise with health status
 */
export async function testBackendConnection(): Promise<{
  status: string;
  message: string;
  apiUrl: string;
}> {
  const url = `${API_CONFIG.baseUrl}/health`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return {
        status: 'error',
        message: `Backend returned status ${response.status}`,
        apiUrl: API_CONFIG.baseUrl,
      };
    }

    const data = await response.json();
    return {
      status: 'success',
      message: `Backend is running in ${data.env} mode`,
      apiUrl: API_CONFIG.baseUrl,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to connect to backend',
      apiUrl: API_CONFIG.baseUrl,
    };
  }
}
