<template>
    <div>
        task id

        {{ id }}

        <div v-for="task in GetTasks" key="task.id">
            {{ task.name }}
            {{ task.comm }}
        </div>
    </div>
</template>
<script setup>
    const supabase = useSupabase();
    const { id } = useRoute().params

    const { data: GetTasks } = await useAsyncData(async () => {
        const { data, error } = await supabase
            .from('tasks_it')
            .select('*')
            .eq('id', id)
        if (error) throw new Error(error.message)
        return data
    })

    
</script>