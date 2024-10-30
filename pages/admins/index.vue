<template>
  <div class="bg-red-200">
    <div class="container mx-auto w-full md:w-4/5 p-4">
      <div class="container mx-auto w-full md:w-4/5 mb-4">
        <div class="bg-base-200 collapse">
          <input type="checkbox" class="peer" />
          <div
            class="collapse-title bg-primary text-primary-content peer-checked:bg-accent peer-checked:text-accent-content"
          >
            Filter 
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
      <div class="card py-4 px-2 mx-auto  w-full md:w-4/5 bg-accent min-h-fit h-auto overflow-x-auto">
        <table class="table w-full text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>ประเภท</th>
              <th>เรื่อง</th>
              <th>สถานะ</th>
              <th>วันที่แจ้ง</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="hover:bg-secondary"
              v-for="task in FormatTask"
              :key="task.id"
            >
              <td>
                <span class="badge badge-primary badge-outline">{{ task.id }}</span>
              </td>
              <td>{{ task.type }}</td>
              <td>{{ task.name }}</td>  
              <td class="text-center">
                <span :class="{
                  'badge badge-success': task.status === 'Success',
                  'badge badge-error': task.status === 'Cancel',
                  'badge badge-warning': task.status === 'Pending',
                  'badge badge-primary': task.status === 'In Progress' // เพิ่มสถานะใหม่ถ้าต้องการ
                }">
                  {{ task.status }}
                </span>
              </td>

              <td class="whitespace-nowrap">{{ task.formatedTask }}</td>
              <td>
                <div class="dropdown dropdown-hover">
                  <button class="btn btn-primary btn-sm">
                    ตัวเลือก
                  </button>
                  <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 z-50">
                    <li>
                      <a @click="openConfirmModal(task.id, 'Success')">ยืนยัน</a>
                    </li>
                    <li>
                      <a @click="openConfirmModal(task.id, 'Cancel')">ยกเลิก</a>
                    </li>
                    <li>
                      <NuxtLink :to="`/tasks/${task.id}`">รายละเอียด</NuxtLink>
                    </li>
                  </ul>
                </div>

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
        .update({ status: newStatus,
          updated_at: new Date().toISOString()
         })
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
