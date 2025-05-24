import supabase from './supabase';

/**
 * Send a friendship request to another user
 * @param {string} user2_id - The ID of the user to send the request to
 * @returns {Promise<{data: any, error: any}>}
 */
export const sendFriendshipRequest = async (user2_id) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('friendships')
      .insert([
        {
          user1_id: user.id,
          user2_id: user2_id,
          status: 'pending'
        }
      ])
      .select();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

/**
 * Accept a friendship request
 * @param {string} friendshipId - The ID of the friendship request to accept
 * @returns {Promise<{data: any, error: any}>}
 */
export const acceptFriendshipRequest = async (friendshipId) => {
  try {
    const { data, error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId)
      .select();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

/**
 * Get all friendships for the current user (both sent and received)
 * @returns {Promise<{data: any, error: any}>}
 */
export const getFriendships = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('friendships')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

/**
 * Get pending friendship requests received by the current user
 * @returns {Promise<{data: any, error: any}>}
 */
export const getPendingRequests = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('friendships')
      .select('*')
      .eq('user2_id', user.id)
      .eq('status', 'pending');

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}; 