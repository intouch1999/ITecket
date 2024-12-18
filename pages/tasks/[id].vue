<template>
  <div class="bg-white pt-16">
    <div class="container mx-auto w-full p-4 md:w-4/5 min-h-screen h-auto overflow-auto">
      <div v-if="pageLoading" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="text-white text-center">
          <Loading />
          <p class="mt-2">กำลังโหลดข้อมูล...</p>
        </div>
      </div>

      <div class="w-full bg-purple-300 p-4 card rounded-2xl border-2 border-red-200 shadow-xl h-full">
        <h1 class="text-4xl text-center text-secondary mb-4">รายละเอียด</h1>
        
        <div class="flex flex-row justify-center mb-4">
          <ul class="steps">
            <template v-if="GetTasks[0].status !== 'Cancel'">
              <li class="step" :class="{ 'step-secondary': true }">ดำเนินการ</li>
              <li class="step" :class="{ 'step-secondary': GetTasks[0].status === 'Success' }">เสร็จสิ้น</li>
            </template>
            <template v-else>
              <li class="step" :class="{ 'step-secondary': true }">ดำเนินการ</li>
              <li class="step" :class="{ 'step-secondary': GetTasks[0].status === 'Cancel' }">ยกเลิก</li>
            </template>
          </ul>
        </div>

        <div v-for="task in GetTasks" :key="task.id">
          <div class="card p-4 bg-gray-200 mb-4">
            <div class="flex items-center">
              <span class="text-lg">หมายเลข ID:</span>
              <span class="ml-4 text-secondary text-base">{{ task.id }}</span>
            </div>
          </div>

          <div class="card p-4 bg-gray-200 mb-4">
            <div class="flex items-center flex-col md:justify-between md:flex-row w-full">
              <div>
              <span class="text-lg">ชื่องาน:</span>
              <span v-if="!task.isEditingName" class="w-full md:ml-4 text-secondary text-base">{{ task.name }}</span>
              <input v-else v-model="task.name" class="md:ml-4 justify-start text-base border border-gray-300 rounded p-1" />
              </div>
              <button :disabled="GetTasks[0].status !== 'Pending'" @click="editTaskField(task, 'name')" class="btn btn-sm btn-secondary md:mr-4 mt-2 md:mt-0 text-sm">
                {{ task.isEditingName ? 'Save' : 'Edit' }}
              </button>
            </div>
          </div>

          <div class="card p-4 bg-gray-200 mb-4">
            <div class="flex items-center flex-col md:justify-between md:flex-row w-full">
              <div class="flex items-center">
              <span class=" text-lg">ประเภท: </span>
              <span v-if="!task.isEditingType" class="w-full md:ml-4 text-secondary text-base">{{ task.type }}</span>
              <input v-else v-model="task.type" class="md:ml-4 justify-start text-base border border-gray-300 rounded p-1" />
            </div>
              <button :disabled="GetTasks[0].status !== 'Pending'" @click="editTaskField(task, 'type')" class="btn btn-sm btn-secondary md:mr-4 mt-2 md:mt-0 text-sm ">
                {{ task.isEditingType ? 'Save' : 'Edit' }}
              </button>
            </div>
          </div>

          <div class="card p-4 bg-gray-200 mb-4">
            <div class="flex flex-col items-start">
              <span class="text-lg">รายละเอียดงาน:</span>
              <p v-if="!task.isEditingComm" class="text-secondary text-base text-start">{{ task.comm }}</p>
              <textarea v-else v-model="task.comm" class="w-full text-base border border-gray-300 rounded p-2"></textarea>
              <button :disabled="GetTasks[0].status !== 'Pending'" @click="editTaskField(task, 'comm')" class="w-1/2 self-center  btn btn-sm btn-secondary md:mr-4 mt-2 md:mt-0 text-sm ">
                {{ task.isEditingComm ? 'Save' : 'Edit' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="images && images.length > 0" class="card p-4 bg-gray-200">
          <div class="flex flex-col md:flex-row justify-center items-center">
            <div v-for="image in images" :key="image" class="hover:cursor-pointer hover:scale-105 hover:opacity-75 transition-transform duration-300" @click="openModal(image.file_path)">
              <img :src="image.file_path" alt="Image" class="mb-4 md:mx-4 rounded-lg" style="width: 250px; height: 200px" />
            </div>
          </div>
        </div>

        <Imagemodal :imgSrc="selectedImg" :isOpen="isModalOpen" @close="closeModal" />
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabase();
const { id } = useRoute().params;
const isModalOpen = ref(false);
const selectedImg = ref("");
const pageLoading = ref(false);

const { data: GetTasks } = await useAsyncData(async () => {
  pageLoading.value = true;
  const { data, error } = await supabase.from("tasks_it").select("id, name, type, comm, status, updated_at").eq("id", id);
  if (error) throw new Error(error.message);
  pageLoading.value = false;
  
  // Adding `isEditing` flags to each task
  return data.map(task => ({
    ...task,
    isEditingName: false,
    isEditingType: false,
    isEditingComm: false
  }));
});

const { data: images } = await useAsyncData(async () => {
  const { data, error } = await supabase.from("task_files").select("*").eq("task_id", id);
  if (error) throw new Error(error.message);
  return data;
});

const openModal = (img) => {
  selectedImg.value = img;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Toggle edit mode and save if already editing
const editTaskField = async (task, field) => {
  const editField = `isEditing${field.charAt(0).toUpperCase() + field.slice(1)}`;
  
  if (task[editField]) {
    // Save the updated task to the database
    const { error } = await supabase
      .from("tasks_it")
      .update({ [field]: task[field] })
      .eq("id", task.id);
    if (error) {
      console.error(error.message);
      return;
    }
  }
  // Toggle editing state
  task[editField] = !task[editField];
};
</script>
