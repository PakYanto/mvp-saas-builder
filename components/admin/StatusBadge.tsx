type StatusBadgeProps = {
  status: string;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  baru: { label: 'Baru', className: 'bg-blue-100 text-blue-800' },
  dihubungi: { label: 'Dihubungi', className: 'bg-yellow-100 text-yellow-800' },
  deal: { label: 'Deal', className: 'bg-green-100 text-green-800' },
  gagal: { label: 'Gagal', className: 'bg-red-100 text-red-800' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
