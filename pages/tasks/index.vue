<template>
  <div class="bg-red-200 min-h-screen h-auto">
    <div class="container mx-auto w-full p-4">
      <div
        class="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-5xl card bg-secondary shadow-lg p-4 mx-auto mb-4 border-b-2 border-gray-200"
      >
        <div class="flex">
          <h1 class="text-2xl mx-auto">แจ้งปัญหาการใช้งาน</h1>
        </div>
        <form @submit.prevent="openModal">
          <div class="w-full mx-auto my-4 flex flex-col items-center">
            <label class="form-control w-full sm:w-3/4 mb-2">
              <div class="label">
                <span class="label-text">เรื่องที่ต้องการแจ้ง</span>
              </div>
              <input
                v-model="form.title"
                type="text"
                placeholder="เรื่องที่ต้องการแจ้ง..."
                class="input input-bordered w-full"
              />
            </label>
            <label class="form-control w-full sm:w-3/4 mb-2">
              <div class="label">
                <span class="label-text">รายละเอียด</span>
              </div>
              <textarea
                v-model="form.detail"
                class="textarea textarea-bordered w-full"
                placeholder="ระบุรายละเอียด..."
              />
            </label>
            <label class="form-control w-full sm:w-3/4 mb-4">
              <div class="label">
                <span class="label-text">ประเภท</span>
              </div>
              <select
                v-model="form.category"
                class="select select-bordered w-full"
              >
                <option disabled value="">โปรดเลือก</option>
                <option>Hardware</option>
                <option>Software</option>
                <option>Network</option>
                <option>IP-Phone</option>
                <option>Other</option>
              </select>
            </label>
            <label for="file" class="form-control w-full sm:w-3/4 mb-2">
              <input
                type="file"
                @change="handleFileUpload"
                multiple
                class="file-input file-input-bordered w-full max-w-xs"
              />
            </label>
            <div v-if="form.files.length > 0" class="w-full sm:w-3/4 mb-4">
              <h3 class="text-lg font-semibold mb-2">ตัวอย่างไฟล์:</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div
                  v-for="(file, index) in form.files"
                  :key="index"
                  class="relative"
                >
                  <img
                    v-if="file.type.startsWith('image/')"
                    :src="file.preview"
                    :alt="`Preview ${index + 1}`"
                    class="w-full h-32 object-cover rounded"
                  />
                  <div
                    v-else
                    class="w-full h-32 bg-gray-200 flex items-center justify-center rounded"
                  >
                    <span class="text-sm text-gray-600">{{ file.name }}</span>
                  </div>
                  <button
                    @click="removeFile(index)"
                    class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    type="button"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            <label for="recipient" class="form-control w-full sm:w-3/4 mb-4">
              <div class="label">
                <span class="label-text">ผู้รับผิดชอบ</span>
              </div>
              <select
                v-model="form.recipient"
                class="select select-bordered w-full"
              >
                <option disabled value="">เลือกผู้รับผิดชอบ</option>
                <option
                  v-for="employee in empoyee"
                  :key="employee.id"
                  :value="employee.name"
                >
                  {{ employee.name }}
                </option>
              </select>
            </label>
            <Modal :is-open="ModalState" @close="ModalState = false">
              <template #title>
                <h1 class="text-2xl">ยืนยันการแจ้งปัญหา</h1>
              </template>
              <template #content>
                <p>ยืนยันการแจ้งปัญหาใช่หรือไม่</p>
              </template>
              <template #action>
                <button
                  @click="submitForm"
                  type="button"
                  class="btn btn-primary"
                >
                  ยืนยัน
                </button>
              </template>
            </Modal>
            <button
              @click="openModal"
              type="submit"
              class="btn btn-primary w-3/4 sm:w-1/4 mx-auto block"
            >
              ยืนยัน
            </button>
          </div>
        </form>
      </div>
      <Alert
        :is-open="isAlertOpen"
        :status="alertStatus"
        @close="closeAlert"
        :message="alertMessage"
      />
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabase();

const empoyee = ref([]);

const person = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("name")
    .order("id", { ascending: false });
  if (error) throw new Error(error.message);
  empoyee.value = data;
  return data;
};

onMounted(() => {
  person();
});

const form = reactive({
  title: "",
  detail: "",
  category: "",
  recipient: "",
  files: [],
});

const ModalState = ref(null);
const isAlertOpen = ref(false);
const alertStatus = ref("success");
const alertMessage = ref("");

// เปิด Modal
const openModal = () => {
  ModalState.value = true;
};

const handleFileUpload = (event) => {
  const newFiles = Array.from(event.target.files);
  newFiles.forEach((file) => {
    const fileObject = {
      file: file,
      name: file.name,
      type: file.type,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    };
    form.files.push(fileObject);
  });
};

const removeFile = (index) => {
  if (form.files[index].preview) {
    URL.revokeObjectURL(form.files[index].preview);
  }
  form.files.splice(index, 1);
};

// const submitForm = async () => {
//   try {
//     const { data, error } = await supabase.from("tasks_it").insert({
//       name: form.title,
//       comm: form.detail,
//       type: form.category,
//       role: form.recipient,
//       status: "Pending",
//       filename: form.files.map((f) => f.file),
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     });
//     if (error) throw new Error(error.message);

//     console.log("Form submitted:", {
//       ...form,
//       files: form.files.map((f) => f.file),
//     });

//     // Reset form fields
//     form.title = "";
//     form.detail = "";
//     form.category = "";
//     form.recipient = "";
//     form.files.forEach((file) => {
//       if (file.preview) URL.revokeObjectURL(file.preview);
//     });
//     form.files = [];

//     // Show success alert
//     showAlert("success", "แจ้งปัญหา");
//   } catch (error) {
//     // Show error alert
//     showAlert("error", "แจ้งปัญหา");
//   } finally {
//     // Close the modal
//     ModalState.value = false;
//   }
// };

// components/TaskForm.vue (modified submitForm function)
const submitForm = async () => {
  try {
    // 1. Upload files first
    let uploadResult = { data: [] }
    
    if (form.files.length > 0) {
      const formData = new FormData()
      form.files.forEach((fileObj, index) => {
        formData.append('file', fileObj.file)
      })

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      uploadResult = await uploadResponse.json()
      
      if (uploadResult.status === 'error') {
        throw new Error(uploadResult.message)
      }
    }

    // 2. Save task data
    const { data: taskData, error: taskError } = await supabase
      .from("tasks_it")
      .insert({
        name: form.title,
        comm: form.detail,
        type: form.category,
        role: form.recipient,
        status: "Pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()

    if (taskError) throw taskError

    // 3. Save file records only if files were uploaded
    if (uploadResult.data.length > 0) {
      const fileRecords = uploadResult.data.map(file => ({
        task_id: taskData[0].id,
        file_name: file.fileName,
        original_name: file.originalName,
        file_type: file.fileType,
        file_path: file.filePath,
        file_size: file.fileSize
      }))

      const { error: filesError } = await supabase
        .from("task_files")
        .insert(fileRecords)

      if (filesError) throw filesError
    }

    // Reset form
    form.title = ""
    form.detail = ""
    form.category = ""
    form.recipient = ""
    form.files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview)
    })
    form.files = []

    showAlert("success", "บันทึกข้อมูลสำเร็จ")
  } catch (error) {
    console.error('Error submitting form:', error)
    showAlert("error", `เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`)
  } finally {
    ModalState.value = false
  }
}

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
