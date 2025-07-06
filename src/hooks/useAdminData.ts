// /home/project/src/hooks/useAdminData.ts
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAdminSecurity } from './useAdminSecurity';

export const useAdminData = () => {
  const { logAction, checkPermission } = useAdminSecurity();
  const [loading, setLoading] = useState(false);

  const fetchTableData = async (
    tableName: string, 
    options: {
      select?: string;
      orderBy?: { column: string; ascending: boolean };
      filters?: Array<{ column: string; operator: string; value: any }>;
      limit?: number;
    } = {}
  ) => {
    if (!checkPermission('database_access')) {
      throw new Error('Insufficient permissions');
    }

    setLoading(true);
    try {
      let query = supabase.from(tableName);
      
      if (options.select) {
        query = query.select(options.select);
      } else {
        query = query.select('*');
      }

      if (options.filters) {
        options.filters.forEach(filter => {
          query = query.filter(filter.column, filter.operator, filter.value);
        });
      }

      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending 
        });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error, count } = await query;
      
      if (error) throw error;

      await logAction('data_fetch', { 
        table: tableName, 
        options,
        record_count: data?.length || 0 
      });

      return { data, count };
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (
    tableName: string,
    id: string,
    updates: Record<string, any>
  ) => {
    if (!checkPermission('database_access')) {
      throw new Error('Insufficient permissions');
    }

    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      await logAction('record_updated', { 
        table: tableName, 
        id, 
        updates,
        result: data 
      });

      return data;
    } catch (error) {
      await logAction('record_update_failed', { 
        table: tableName, 
        id, 
        updates,
        error: error.message 
      });
      throw error;
    }
  };

  const deleteRecord = async (tableName: string, id: string) => {
    if (!checkPermission('database_access')) {
      throw new Error('Insufficient permissions');
    }

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      await logAction('record_deleted', { table: tableName, id });
      return true;
    } catch (error) {
      await logAction('record_delete_failed', { 
        table: tableName, 
        id, 
        error: error.message 
      });
      throw error;
    }
  };

  return {
    fetchTableData,
    updateRecord,
    deleteRecord,
    loading
  };
};