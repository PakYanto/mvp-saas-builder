import StatusBadge from '@/components/admin/StatusBadge';

async function getAllLeads() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/projects?limit=1000`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    const projects = data.projects || [];
    
    interface Lead {
      id: string;
      name: string | null;
      phone: string | null;
      email: string | null;
      message: string | null;
      status: string;
      createdAt: string;
    }
    
    interface LeadWithProject extends Lead {
      projectName: string;
    }
    
    // Extract all leads from all projects
    const allLeads: LeadWithProject[] = [];
    for (const project of projects) {
      if (project.leads && Array.isArray(project.leads)) {
        project.leads.forEach((lead: Lead) => {
          allLeads.push({
            ...lead,
            projectName: project.storeName,
          });
        });
      }
    }
    
    // Sort by creation date (newest first)
    allLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return allLeads;
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
}

export default async function LeadsPage() {
  const leads = await getAllLeads();
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">All Leads</h2>
        <p className="mt-1 text-sm text-gray-600">
          Total: {leads.length} leads
        </p>
      </div>
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lead.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
