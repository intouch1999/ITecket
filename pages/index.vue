<template>
  <div class="bg-white pt-16">
    <div class="relative left-0 -bottom-4 z-10 mx-auto w-full md:w-4/5 flex flex-row">
      <div v-if="pageLoading" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="text-white text-center">
          <Loading />
          <p class="mt-2">กำลังโหลดข้อมูล...</p>
        </div>
      </div>

    </div>
    <div class="container mx-auto w-full md:w-4/5 mt-4 ">
      <div role="tablist" class="tabs tabs-lifted text-nowrap w-1/2">
        <a
          v-for="tab in tabs"
          :key="tab.value"
          role="tab"
          class="tab bg-white"
          :class="{ 'tab-active [--tab-bg:#d8b4fe]': currentTab === tab.value }"
          @click="currentTab = tab.value"
        >{{ tab.label }}</a>
      </div>
    </div>
    <div class="container mx-auto w-full md:w-4/5 min-h-screen h-full rounded-b-2xl rounded-tr-2xl bg-purple-300  shadow-2xl mb-4">
      <div class="w-full flex flex-row p-4"></div>
      <div class="w-1/2 flex flex-row p-4 bg-accent text-primary-content rounded-r-2xl mb-4">
        <input :disabled="currentTab !== 'Pending'" type="checkbox" class="checkbox mr-2" :checked="isAllSelected" @change="handleSelectAll" />
        <p>เลือกทั้งหมด</p>
      </div>
      <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  p-2">
      <div v-if="error" class="text-center mt-8 text-error">
        {{ error }}
      </div>

      <div v-else-if="loading" class="col-span-3 w-full text-center mt-8">
        <Loading />
      </div>

      <div
        v-else
        v-for="(task, index) in filteredTasks"
        :key="task.id"
        class="relative px-4 pt-4 pb-2 mx-4 text-xs card bg-white my-2"
      >
        <div class="absolute -top-2 left-5 w-2/6 inline-block">
          <div class="badge badge-secondary">
            {{ task.status }}
          </div>
        </div>
        <div class="grid grid-cols-[auto_1fr_auto] justify-between gap-2">
          <div class="flex items-center">
            <input
              type="checkbox"
              class="checkbox"
              :checked="selectedTasks.includes(task.id)"
              @change="toggleTaskSelection(task.id)"
              :disabled="task.status !== 'Pending'"
            />
          </div>
          <div class="flex flex-col flex-grow" :class="{ 'line-through': task.status == 'Cancel'}">
            <div class="w-full mt-2">
              <span>{{ task.name }}</span>
            </div>
            <div class="w-full mt-2" :class="{ 'line-through': task.status == 'Cancel'}">
              {{ task.type }}
            </div>
          </div>
          <div class="flex justify-end items-center">
            <button @click="handledInfo(task.id)" class="bg-accent text-primary-content rounded-full p-2 hover:bg-secondary duration-300 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex justify-end text-xs mt-1 text-black opacity-50 w-full">
          {{ task.formatedTask }}
        </div>
      </div>
      <div class="w-full flex flex-row p-4"></div>
    </div>
  </div>
</div>
<div     v-if="selectedTasks.length > 0">
  <div
    class="fixed bottom-0 left-0 right-0 w-full flex flex-col bg-accent text-primary-content p-4"
  >
    <div class="text-center my-2">
      ต้องการดำเนินการยกเลิก {{ selectedTasks.length }} รายการใช่หรือไม่
    </div>
    <div class="flex justify-evenly">
      <button class="btn btn-sm" @click="handleConfirmCancel">
        ยืนยัน
      </button>
      <button class="btn btn-sm" @click="clearSelection">
        ยกเลิก
      </button>
    </div>
  </div>
</div>
<Alert
        :is-open="isAlertOpen"
        :status="alertStatus"
        @close="closeAlert"
        :message="alertMessage"
      />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
const supabase = useSupabase();

const loading = ref(false);
const error = ref(null);
const tasks = ref([]);
const isAlertOpen = ref(false);
const alertStatus = ref("success");
const alertMessage = ref("");
// Global state
const pageLoading = usePageLoading()

const tabs = [
  { label: "ดำเนินการ", value: "Pending" },
  { label: "เสร็จสิ้น", value: "Success" },
  { label: "ยกเลิก", value: "Cancel" },
];

const currentTab = ref("Pending");
const selectedTasks = ref([]);

const fetchTasks = async () => {
  try {
    loading.value = true;
    // await new Promise(resolve =>setTimeout(resolve, 1000))
    error.value = null;
    const { data, error: supabaseError } = await supabase
      .from("tasks_it")
      .select("id, name, type, comm, status, updated_at")
      .order("updated_at", { ascending: false });
    
    if (supabaseError) throw new Error(supabaseError.message);
    
    tasks.value = data;
  } catch (err) {
    error.value = err.message;
    console.error('Error fetching tasks:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  pageLoading.value = true;
  try{
    await fetchTasks();
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
  pageLoading.value = false;
});

const FormatTask = computed(() => {
  return tasks.value?.map((item) => ({
    ...item,
    limitText: limitText(item.comm, 40),
    formatedTask: formatDate(item.updated_at),
  }));
});

watch (currentTab, () => {
  selectedTasks.value = [];
});

const filteredTasks = computed(() => {
  return FormatTask.value?.filter((task) => task.status === currentTab.value) || [];
});

const isAllSelected = computed(() => {
  return (
    filteredTasks.value.length > 0 &&
    filteredTasks.value.every((task) => selectedTasks.value.includes(task.id))
  );
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const limitText = (text, limit) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

const handledInfo = (id) => {
  navigateTo(`/tasks/${id}`);
};

const handleSelectAll = () => {
  if (isAllSelected.value) {
    selectedTasks.value = [];
  } else {
    selectedTasks.value = filteredTasks.value.map((task) => task.id);
  }
};

const toggleTaskSelection = (taskId) => {
  if (selectedTasks.value.includes(taskId)) {
    selectedTasks.value = selectedTasks.value.filter((id) => id !== taskId);
  } else {
    selectedTasks.value.push(taskId);
  }
};

const clearSelection = () => {
  selectedTasks.value = [];
};

const handleConfirmCancel = async () => {
  try {
    loading.value = true;
    const { error: updateError } = await supabase
      .from('tasks_it')
      .update({ status: 'Cancel' , updated_at: new Date().toISOString() })
      .in('id', selectedTasks.value);

    if (updateError) throw new Error(updateError.message);
    showAlert("success", `ยกเลิกรายการสำเร็จ จำนวน ${selectedTasks.value.length} รายการ`);
    selectedTasks.value = [];
    await fetchTasks(); // Refresh the tasks after update
  } catch (err) {
    error.value = err.message;
    console.error('Error updating tasks:', err);
    showAlert("error", `เกิดข้อผิดพลาด: ${err.message}`);
  } finally {
    loading.value = false;
  }
};

const showAlert = (status, message) => {
  alertStatus.value = status;
  alertMessage.value = message;
  isAlertOpen.value = true;

  // Automatically close the alert after 3 seconds
  setTimeout(closeAlert, 3000);
};

const closeAlert = () => {
  isAlertOpen.value = false;
};
</script>