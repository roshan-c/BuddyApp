import supabase from './supabase';

/**
 * Create a new log entry for the authenticated user
 * @param {string} userId - The user's ID
 * @param {Object} logData - The log entry data (e.g., notes, timestamp, etc.)
 * @returns {Promise} Supabase response
 */
export const createLogEntry = async (userId, logData) => {
  try {
    const { data, error } = await supabase
      .from('logs')
      .insert([
        {
          user_id: userId,
          ...logData,
          created_at: new Date().toISOString(),
        }
      ]);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating log entry:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return { data: null, error };
  }
};

/**
 * Get all log entries that the current user is authorized to see (own logs + friends' logs)
 * RLS policies handle the filtering automatically
 * @returns {Promise} Supabase response with log entries
 */
export const getLogEntries = async () => {
  try {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching log entries:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return { data: null, error };
  }
}; 