import { useOCRLogs } from '@/hooks/petition/useOCRLogs';
import { ScrollArea } from '@/components/ui/scroll-area';

export const OCRLogs = () => {
  const { logs, isConnected } = useOCRLogs();

  const getLogColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="w-full max-h-[200px] border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Processing Logs</h3>
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
      <ScrollArea className="h-[150px]">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center">Waiting for logs...</p>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-sm">
                <span className={getLogColor(log.level)}>[{log.level.toUpperCase()}]</span>
                <span className="ml-2">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}; 