<template>
  <div class="bg-red-200">
    <div
      class="container mx-auto w-full p-4 md:w-4/5 min-h-screen h-auto overflow-auto"
    >
      <div
        class="w-full p-4 card bg-base-100 rounded-2xl border-2 border-red-200 shadow-xl h-full"
      >
        <h1 class="text-4xl text-center text-red-300 mb-4">รายละเอียด</h1>
        <div class="flex flex-row justify-center mb-4">
          <ul class="steps">
            <template v-if="GetTasks[0].status !== 'Cancel'">
              <li class="step" :class="{ 'step-primary': true }">ดำเนินการ</li>
              <li
                class="step"
                :class="{ 'step-primary': GetTasks[0].status === 'Success' }"
              >
                เสร็จสิ้น
              </li>
            </template>

            <template v-else>
              <li class="step" :class="{ 'step-primary': true }">ดำเนินการ</li>
              <li
                class="step"
                :class="{ 'step-primary': GetTasks[0].status === 'Cancel' }"
              >
                ยกเลิก
              </li>
            </template>
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
        <div v-if="images && images.length > 0" class="card p-4 bg-gray-200">
          <div class="flex flex-col md:flex-row justify-center items-center">
            <div
              v-for="image in images"
              :key="image"
              class="hover:cursor-pointer hover:scale-105 hover:opacity-75 transition-transform duration-300"
              @click="openModal(image.file_path)"
            >
              <img
                :src="image.file_path"
                alt="Image"
                class="mb-4 md:mx-4 rounded-lg"
                style="width: 250px; height: 200px"
              />
            </div>
          </div>
        </div>

        <Imagemodal
          :imgSrc="selectedImg"
          :isOpen="isModalOpen"
          @close="closeModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabase();
const { id } = useRoute().params;
const isModalOpen = ref(false);
const selectedImg = ref("");

const { data: GetTasks } = await useAsyncData(async () => {
  const { data, error } = await supabase
    .from("tasks_it")
    .select("*")
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
});

const { data: images } = await useAsyncData(async () => {
  const { data, error } = await supabase
    .from("task_files")
    .select("*")
    .eq("task_id", id);
  if (error) throw new Error(error.message);
  console.log(data);
  return data;
});

const openModal = (img) => {
  selectedImg.value = img;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>
