
import React from 'react';
import { AuditLog } from '../types';
import { Activity, Shield, Clock, Smartphone } from 'lucide-react';

interface AdminLogsViewProps {
  logs: AuditLog[];
}

const AdminLogsView: React.FC<AdminLogsViewProps> = ({ logs }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">AUDIT LOGS</h2>
        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
           <Shield size={20} />
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-3xl overflow-hidden">
         <div className="divide-y divide-gray-800">
            {logs.length === 0 ? (
              <div className="p-20 text-center text-gray-600 font-bold italic">Chưa có bản ghi hoạt động</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-5 hover:bg-black/20 transition-colors">
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-black text-[#FF8C1A]">{log.performerName}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-gray-600">
                         <Clock size={12} />
                         <span>{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                      </div>
                   </div>
                   <p className="text-xs text-white font-medium mb-3">{log.action}</p>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold">
                         <Shield size={10} className="text-gray-600" />
                         <span>IP: {log.ip}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold">
                         <Smartphone size={10} className="text-gray-600" />
                         <span>{log.deviceId}</span>
                      </div>
                   </div>
                </div>
              ))
            )}
         </div>
      </div>
    </div>
  );
};

export default AdminLogsView;
