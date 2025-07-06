// /home/project/src/components/AdminDataTable.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { 
  ChevronLeft, ChevronRight, Eye, Edit2, Trash2, 
  Search, Filter, Download, RefreshCw 
} from 'lucide-react';
import { useAdminData } from '../hooks/useAdminData';

interface AdminDataTableProps {
  tableName: string;
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, record: any) => React.ReactNode;
  }>;
  title: string;
  permissions?: {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
    export?: boolean;
  };
}

export const AdminDataTable: React.FC<AdminDataTableProps> = ({
  tableName,
  columns,
  title,
  permissions = { view: true, edit: true, delete: true, export: true }
}) => {
  const { fetchTableData, updateRecord, deleteRecord, loading } = useAdminData();
  const [data, setData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<{ column: string; ascending: boolean } | null>(null);

  const loadData = async () => {
    try {
      const result = await fetchTableData(tableName, {
        orderBy: sortBy || { column: 'created_at', ascending: false },
        limit: pageSize,
        // Add search and pagination logic here
      });
      
      setData(result.data || []);
      setTotalCount(result.count || 0);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [tableName, currentPage, sortBy]);

  const handleSort = (column: string) => {
    setSortBy(prev => ({
      column,
      ascending: prev?.column === column ? !prev.ascending : true
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
      await deleteRecord(tableName, id);
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const exportData = async () => {
    try {
      const result = await fetchTableData(tableName);
      const csvContent = convertToCSV(result.data || []);
      downloadCSV(csvContent, `${tableName}_export.csv`);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(record => 
      columns.map(col => {
        const value = record[col.key];
        return typeof value === 'string' ? `"${value}"` : value || '';
      }).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{totalCount} records total</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Button size="sm" variant="outline" onClick={loadData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            {permissions.export && (
              <Button size="sm" variant="outline" onClick={exportData}>
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && sortBy?.column === column.key && (
                        <span className="text-blue-500">
                          {sortBy.ascending ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                data.map((record, index) => (
                  <tr key={record.id || index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-4 whitespace-nowrap text-sm">
                        {column.render 
                          ? column.render(record[column.key], record)
                          : record[column.key] || '-'
                        }
                      </td>
                    ))}
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {permissions.view && (
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {permissions.edit && (
                          <Button size="sm" variant="ghost">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        {permissions.delete && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(record.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};