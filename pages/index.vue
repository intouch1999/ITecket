<template>
    <div class="container mx-auto w-full mb-4">
    </div>
    <div class="container mx-auto w-4/5 mb-4 card bg-primary rounded-2xl">
        <div class="w-1/2 flex flex-row p-4">
        <div role="tablist" class="tabs tabs-boxed">
        <a role="tab" class="tab">กำลังดำเนินการ</a>
        <a role="tab" class="tab tab-active">เสร็จสิ้น</a>
        <a role="tab" class="tab">ยกเลิก</a>
        </div>
        </div>
        <div v-for="(task,index) in FormatTask " :key="index" class="p-4 mx-4 flex flex-row card bg-secondary my-2 justify-between items-center">
        <div class="flex-1">
            <div class="badge badge-info gap-2 p-4">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    class="inline-block h-4 w-4 stroke-current">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M6 18L18 6M6 6l12 12"></path>
  </svg>
  {{  task.status }}
</div>
        </div>
        <div class="basis-1/6 w-1/6 px-4">
            {{ task.formatedTask }}.
        </div>
        <div class="basis-2/3 w-1/3 px-4" >
            {{ task.limitText }}
        </div>

        <div class="basis-1/6 w-1/6 px-4">
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
        try{
        const {data , error} = await useFetch(`${TasksAPI}` , {
            method: 'GET'
        })
        if(!error.value){
            console.log(data.value)
        }
        task.value = data.value
        }
        catch(error){
            console.log(error)
        }}
    
    tasksIT()

</script>