import { useEffect, useState } from 'react';

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
}

export const useOCRLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('/api/ocr/logs');

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      const logEntry = JSON.parse(event.data);
      setLogs((prevLogs) => [...prevLogs, logEntry]);
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { logs, isConnected };
}; 