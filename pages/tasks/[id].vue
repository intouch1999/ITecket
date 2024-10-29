<template>
  <div class="bg-red-200">
    <div class="container mx-auto w-full p-4 md:w-4/5 min-h-screen h-auto overflow-auto">
      <div class="w-full p-4 card bg-base-100 rounded-2xl border-2 border-red-200 shadow-xl h-full">
        <h1 class="text-4xl text-center text-red-300 mb-4">รายละเอียด</h1>
        <div class="flex flex-row justify-center mb-4">
          <ul class="steps">
            <li
              v-if="GetTasks[0].status !== 'Cancel'"
              v-for="taskStatus in sliced"
              :key="taskStatus.value"
              :class="{ 'step step-primary': taskStatus.value === GetTasks[0].status }"
              class="step"
            >
              {{ taskStatus.label }}
            </li>
            <li
              v-else
              v-for="(taskStatus , index) in taskStatus"
              :key="index"
              :class="{ 'step step-primary': taskStatus.value === GetTasks[0].status }"
              class="step"
            >
              {{ taskStatus.label }}
            </li>
          </ul>
        </div>
        <div v-for="task in GetTasks" :key="task.id">
          <div class="card p-4 bg-gray-200 mb-4">
            <div class="flex flex-row items-center">
              <span class="text-lg">หมายเลข ID: </span>
              <span class="ml-4 text-primary text-base">{{ task.id }}</span>
            </div>
          </div>
          <div class="card p-4 bg-gray-200 mb-4">
            <div class="flex flex-row items-center">
              <span class="text-lg">ชื่องาน: </span>
              <span class="ml-4 text-primary text-base">{{ task.name }}</span>
            </div>
          </div>
          <div class="card p-4 bg-gray-200 mb-4">
            <div class="flex flex-row items-center">
              <span class="text-lg">ประเภท: </span>
              <span class="ml-4 text-primary text-base">{{ task.type }}</span>
            </div>
          </div>
          <div class="card p-4 bg-gray-200 mb-4">
            <div class="flex flex-col">
              <span class="text-lg">รายละเอียดงาน: </span>
              <p class="text-primary text-base text-start">{{ task.comm }}</p>
            </div>
          </div>
        </div>
        <div class="card p-4 bg-gray-200">
            <div class="flex flex-col md:flex-row justify-center items-center">
              <div v-if="images && images.length > 0" v-for="image in images" :key="image">
                <img :src="image.file_path"   alt="Image" class="mb-4 md:mx-4 rounded-lg" style="width: 250px; height: 250px;" />
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const supabase = useSupabase();
const { id } = useRoute().params;

const taskStatus = [
  { label: "ดำเนินการ", value: "Pending" },
  { label: "เสร็จสิ้น", value: "Success" },
  { label: "ยกเลิก", value: "Cancel" },
];

const sliced = ref([])

const listTasks = () => {
  sliced.value = taskStatus.slice(0, 2);
}
listTasks()

const { data: GetTasks } = await useAsyncData(async () => {
  const { data, error } = await supabase
    .from("tasks_it")
    .select("*")
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
});

const { data:images  } = await useAsyncData(async () => {
  const { data, error } = await supabase
    .from("task_files")
    .select("*")
    .eq("task_id", id);
  if (error) throw new Error(error.message);
  console.log(data)
  return data;
});


</script>
