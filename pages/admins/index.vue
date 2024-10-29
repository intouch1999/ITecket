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
              <th>ลําดับ</th>
              <th>ประเภท</th>
              <th>เรื่อง</th>
              <th>สถานะ</th>
              <th>วันที่</th>
              <th></th>
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
                <NuxtLink :to="`/tasks/${task.id}`">รายละเอียด</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabase();

const table = ref([]);

const listTasks = async () => {
  const { data, error } = await supabase
    .from("tasks_it")
    .select("*")

  if (error) throw new Error(error.message);
  table.value = data;
  return data;
};

const FormatTask = computed(() => {
  return table.value?.map((item) => ({
    ...item,
    formatedTask: formatDate(item.updated_at),
  }));
});
console.log(FormatTask)

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

onMounted(() => {
  listTasks();
});
</script>
