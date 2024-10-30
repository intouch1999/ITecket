<template>
  <div class="bg-red-200">
    <div class="container mx-auto w-4/5 p-4">
      <div class="container mx-auto w-4/5 mb-4">
        <div class="bg-base-200 collapse">
          <input type="checkbox" class="peer" />
          <div
            class="collapse-title bg-primary text-primary-content peer-checked:bg-accent peer-checked:text-accent-content"
          >
            Click me to show/hide content
          </div>
          <div
            class="collapse-content bg-primary text-primary-content peer-checked:bg-accent peer-checked:text-accent-content"
          >
            <div>
              <input
                type="text"
                placeholder="Search..."
                class="input input-bordered w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="card p-4 mx-auto w-4/5 bg-accent min-h-screen h-auto">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ประเภท</th>
              <th>เรื่อง</th>
              <th>สถานะ</th>
              <th>วันที่แจ้ง</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in FormatTask" :key="task.id">
              <td>{{ task.id }}</td>
              <td>{{ task.type }}</td>
              <td>{{ task.name }}</td>
              <td>{{ task.status }}</td>
              <td>{{ task.formatedTask }}</td>
              <td>
                <NuxtLink class="btn btn-primary btn-sm" :to="`/tasks/${task.id}`">รายละเอียด</NuxtLink>
                <button
                  class="ml-2 btn btn-success btn-sm"
                  @click="openConfirmModal(task.id, 'Success')"
                >
                  ยืนยัน
                </button>
                <button
                  class="ml-2 btn btn-error btn-sm"
                  @click="openConfirmModal(task.id, 'Cancel')"
                >
                  ยกเลิก
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="showModal" class="fixed bottom-0 left-0 right-0 w-full flex flex-col bg-secondary text-primary-content p-4">
      <div class="text-center my-2">
        ต้องการดำเนินการ {{ actionType }} สำหรับ Task ID: {{ selectedTaskId }} ใช่หรือไม่
      </div>
      <div class="flex justify-evenly">
        <button class="btn btn-sm" @click="handleConfirm">
          ยืนยัน
        </button>
        <button class="btn btn-sm" @click="clearAction">
          ยกเลิก
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

const supabase = useSupabase();

const table = ref([]);
const showModal = ref(false);
let selectedTaskId = ref(null);
let actionType = ref('');

const listTasks = async () => {
  const { data, error } = await supabase
    .from("tasks_it")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  table.value = data;
  return data;
};

const FormatTask = computed(() => {
  return table.value?.map((item) => ({
    ...item,
    formatedTask: formatDate(item.created_at),
  }));
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

const openConfirmModal = (taskId, type) => {
  selectedTaskId.value = taskId;
  actionType.value = type;
  showModal.value = true;
};

const handleConfirm = async () => {
  if (selectedTaskId.value) {
    const newStatus = actionType.value === 'Success' ? 'Success' : 'Cancel';
    try {
      const { data, error } = await supabase
        .from("tasks_it")
        .update({ status: newStatus })
        .eq("id", selectedTaskId.value);
      
      if (error) throw new Error(error.message);
      await listTasks();
    } catch (err) {
      console.error("Error updating tasks:", err);
    } finally {
      clearAction();
    }
  }
};

const clearAction = () => {
  showModal.value = false;
  selectedTaskId.value = null;
  actionType.value = '';
};

onMounted(() => {
  listTasks();
});
</script>
