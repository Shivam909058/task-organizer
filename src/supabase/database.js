import { supabase } from './config'

const db = {
    notes: {
        create: async (payload) => {
            const formattedPayload = {
                ...payload,
                colors: payload.colors || { background: '#ffffff', text: '#000000' }
            }

            const { data, error } = await supabase
                .from('notes')
                .insert(formattedPayload)
                .select()
                .single()
            
            if (error) throw error
            return data
        },

        update: async (id, payload) => {
            const formattedPayload = {
                ...payload,
                colors: payload.colors || { background: '#ffffff', text: '#000000' }
            }

            const { data, error } = await supabase
                .from('notes')
                .update(formattedPayload)
                .eq('id', id)
                .select()
                .single()
            
            if (error) throw error
            return data
        },

        delete: async (id) => {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', id)
            
            if (error) throw error
            return true
        },

        get: async (id) => {
            const { data, error } = await supabase
                .from('notes')
                .select()
                .eq('id', id)
                .single()
            
            if (error) throw error
            return data
        },

        list: async () => {
            const { data, error } = await supabase
                .from('notes')
                .select()
                .order('created_at', { ascending: false })
            
            if (error) throw error
            return data
        }
    }
}

export { db } 