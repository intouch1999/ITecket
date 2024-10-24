<template>
    <div class="container mx-auto w-full mb-4">
    </div>
    <div class="container mx-auto w-4/5 mb-4 card bg-primary rounded-2xl">
        <div class="w-full flex flex-row p-4">
            <div role="tablist" class="tabs tabs-boxed">
                <a role="tab" class="tab">ดำเนินการ</a>
                <a role="tab" class="tab tab-active">เสร็จสิ้น</a>
                <a role="tab" class="tab">ยกเลิก</a>
            </div>
        </div>
        <div v-for="(task, index) in FormatTask " :key="index"
            class="relative p-4 mx-4 flex flex-row flex-wrap text-xs card bg-secondary my-2 justify-center items-center ">
            <div class="w-1/3">
                <input type="checkbox" class="checkbox"/>
            </div>
            <div class="absolute -top-2 left-5 w-2/6 inline-block">
                <div class=" badge badge-info ">
                    {{ task.status }}
                </div>
            </div>
            <div class="w-full mt-2">
                {{ task.formatedTask }}.
            </div>
            <div class="w-2/3 mt-2">
                {{ task.limitText }}
            </div>

            <div class="w-1/3 text-center">
                action
            </div>
        </div>
    </div>

</template>

<script setup>

const config = useRuntimeConfig()
const TasksAPI = config.public.apiBase

const task = ref([])

const FormatTask = computed(() => {
    return task.value.map(item => ({
        ...item,
        limitText: limitText(item.des, 75),
        formatedTask: formatDate(item.createdAt)
    }))
})

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const limitText = (text, limit) => {
    return text.length > limit ? text.slice(0, limit) + '...' : text
}

const tasksIT = async () => {
    try {
        const { data, error } = await useFetch(`${TasksAPI}`, {
            method: 'GET'
        })
        if (!error.value) {
            console.log(data.value)
        }
        task.value = data.value
    }
    catch (error) {
        console.log(error)
    }
}

tasksIT()

</script>