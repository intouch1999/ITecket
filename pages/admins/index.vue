<template>
  <div class="bg-red-200">
    <div class="container mx-auto w-full md:w-4/5 p-4 min-h-[75vh] h-auto">
      <div class="">
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
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              <!-- Search Input -->
              <div class="form-control">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="ค้นหาด้วย ID หรือ ชื่อ..."
                  class="input input-bordered w-full"
                  @input="updateFilters"
                />
              </div>
              
              <!-- Status Filter -->
              <div class="form-control">
                <select 
                  v-model="selectedStatus"
                  class="select select-bordered w-full"
                  @change="updateFilters"
                >
                  <option value="">สถานะทั้งหมด</option>
                  <option value="Pending">Pending</option>
                  <option value="Success">Success</option>
                  <option value="Cancel">Cancel</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>

              <!-- Clear Filters -->
              <div class="form-control">
                <button 
                  class="btn btn-secondary"
                  @click="clearFilters"
                >
                  ล้างการค้นหา
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="card p-4 w-full md:w-full bg-accent overflow-x-auto">
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
              v-for="task in filteredTasks"
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
                  'badge badge-primary': task.status === 'In Progress'
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

        <!-- No Results Message -->
        <div v-if="filteredTasks.length === 0" class="text-center py-4">
          <p class="text-gray-500">ไม่พบข้อมูลที่ค้นหา</p>
        </div>
      </div>
    </div>


    <!-- Confirmation Modal -->
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
  </div>
</template>

<script setup>
const supabase = useSupabase();
const route = useRoute();
const router = useRouter();

// State
const table = ref([]);
const showModal = ref(false);
const selectedTaskId = ref(null);
const actionType = ref('');
const searchQuery = ref('');
const selectedStatus = ref('');

// Initialize filters from URL
onMounted(async () => {
  // Get initial values from URL
  searchQuery.value = route.query.search || '';
  selectedStatus.value = route.query.status || '';
  
  await listTasks();
});

// Watch for route changes
watch(
  () => route.query,
  (newQuery) => {
    searchQuery.value = newQuery.search || '';
    selectedStatus.value = newQuery.status || '';
  }
);

// Methods
const listTasks = async () => {
  try {
    const { data, error } = await supabase
      .from("tasks_it")
      .select("id, name, type, comm, status, updated_at")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    table.value = data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

const updateFilters = () => {
  // Update URL with current filters
  const query = {};
  if (searchQuery.value) query.search = searchQuery.value;
  if (selectedStatus.value) query.status = selectedStatus.value;
  
  // Update URL without refreshing the page
  router.push({ query });
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = '';
  router.push({ query: {} });
};

// Computed
const filteredTasks = computed(() => {
  let filtered = table.value;

  // Apply search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase();
    filtered = filtered.filter(task => 
      task.id.toString().includes(search) ||
      task.name.toLowerCase().includes(search)
    );
  }

  // Apply status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(task => 
      task.status === selectedStatus.value
    );
  }

  // Format dates
  return filtered.map((item) => ({
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
      const { error } = await supabase
        .from("tasks_it")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedTaskId.value);
      
      if (error) throw error;
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
</script>