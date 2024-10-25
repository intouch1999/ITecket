<template>
  <div class="bg-red-200">
    <div
      class="relative left-0 -bottom-4 z-10 mx-auto w-full md:w-4/5 flex flex-row"
    >
      <div role="tablist" class="tabs tabs-boxed border-2 border-red-200">
        <a
          v-for="tab in tabs"
          :key="tab.value"
          role="tab"
          class="tab"
          :class="{ 'tab-active': currentTab === tab.value }"
          @click="currentTab = tab.value"
          >{{ tab.label }}</a
        >
      </div>
    </div>
    <div
      class="container mx-auto w-full md:w-4/5 min-h-screen h-full card bg-primary rounded-2xl border-2 border-red-200 shadow-2xl"
    >
      <div class="w-full flex flex-row p-4"></div>
      <div v-if="loading" class="text-center mt-8">
        <span class="loading loading-infinity loading-lg"></span>
      </div>
      <div
        v-else
        v-for="(task, index) in filteredTasks"
        :key="task.id"
        class="relative px-4 pt-4 pb-2 mx-4 text-xs card bg-accent my-2"
      >
        <div class="absolute -top-2 left-5 w-2/6 inline-block">
          <div class="badge badge-secondary">
            {{ task.status }}
          </div>
        </div>
        <div class="grid grid-cols-[auto_1fr_auto] justify-between gap-2">
          <div class="flex items-center">
            <input type="checkbox" class="checkbox" 
                       :checked="isAllSelected"
            @change="handleSelectAll"
            />
          </div>
          <div class="flex flex-col flex-grow">
            <div class="w-full mt-2">
              <span>{{ task.name }}</span>
            </div>
            <div class="w-full mt-2">
              {{ task.limitText }}
            </div>
          </div>
          <div class="flex justify-end items-center">
            <button @click="handledInfo(task.id)" class="bg-primary text-primary-content rounded-full p-2">
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
  <div v-if="selectedTasks.length > 0" class="fixed bottom-0 left-0 right-0 w-full flex flex-col bg-secondary text-primary-content p-4">
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
</template>

<script setup>
const supabase = useSupabase();

const loading = ref(false);
const tabs = [
  { label: "ดำเนินการ", value: "Pending" },
  { label: "เสร็จสิ้น", value: "Success" },
  { label: "ยกเลิก", value: "Cancel" },
];

const currentTab = ref("Pending");
const CancelConfirm = ref(false);
const selectedTasks = ref([]);

const { data: GetTasks } = await useAsyncData(async () => {
  loading.value = true;
  const { data, error } = await supabase.from("tasks_it").select("*");
  if (error) throw new Error(error.message);
  loading.value = false;
  return data;
});

const FormatTask = computed(() => {
  return GetTasks.value?.map((item) => ({
    ...item,
    limitText: limitText(item.comm, 25),
    formatedTask: formatDate(item.updated_at),
  }));
});

// const filteredTasks = computed(() => {
//   return FormatTask.value.filter((task) => task.status === currentTab.value);
// });

const filteredTasks = computed(() => {
  return FormatTask.value?.filter((task) => task.status === currentTab.value) || [];
});

const isAllSelected = computed(() => {
  return filteredTasks.value.length > 0 && 
         filteredTasks.value.every(task => selectedTasks.value.includes(task.id));
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
    selectedTasks.value = filteredTasks.value.map(task => task.id);
  }
};

</script>
