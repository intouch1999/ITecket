<template>
  <div class="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-5xl card bg-yellow-200 p-4 mx-auto mb-4 border-b-2 border-gray-200 shadow-md">
    <div class="flex">
      <h1 class="text-2xl mx-auto">แจ้งปัญหาการใช้งาน</h1>
    </div>
    <form @submit.prevent="openModal">
      <div class="w-full mx-auto my-4 flex flex-col items-center">
        <label class="form-control w-full sm:w-3/4 mb-2">
          <div class="label">
            <span class="label-text">เรื่องที่ต้องการแจ้ง</span>
          </div>
          <input v-model="form.title" type="text" placeholder="ตาลือตกบ้าน" class="input input-bordered w-full  " />
        </label>
        <label class="form-control w-full  sm:w-3/4 mb-2">
          <div class="label">
            <span class="label-text">รายละเอียด</span>
          </div>
          <textarea v-model="form.detail" class="textarea textarea-bordered w-full" placeholder="ระบุรายละเอียด..." />
        </label>
        <label class="form-control w-full  sm:w-3/4 mb-4">
          <div class="label">
            <span class="label-text">ประเภท</span>
          </div>
            <select v-model="form.category"  class="select select-bordered w-full">
            <option disabled value="">SELECT</option>
            <option>HardWare</option>
            <option>SoftWare</option>
            <option>Network</option>
            <option>IP-Phone</option>
            <option>Other</option>
          </select>
        </label>
        <label for="file" class="form-control w-full sm:w-3/4 mb-2">
          <input type="file" @change="handleFileUpload" multiple class="file-input file-input-bordered w-full max-w-xs" />
        </label>
        <div v-if="form.files.length > 0" class="w-full sm:w-3/4 mb-4">
          <h3 class="text-lg font-semibold mb-2">ตัวอย่างไฟล์:</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div v-for="(file, index) in form.files" :key="index" class="relative">
              <img 
                v-if="file.type.startsWith('image/')" 
                :src="file.preview" 
                :alt="`Preview ${index + 1}`"
                class="w-full h-32 object-cover rounded"
              />
              <div v-else class="w-full h-32 bg-gray-200 flex items-center justify-center rounded">
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
        <label  for="recipient" class="form-control w-full  sm:w-3/4 mb-4">
          <div class="label">
            <span class="label-text">ผู้รับ</span>
          </div>
          <select v-model="form.recipient" class="select select-bordered w-full">
            <option disabled value="">Who shot first?</option>
            <option>Han Solo</option>
            <option>Greedo</option>
          </select>
        </label>
        <Modal :is-open="ModalState" @close="ModalState = false" >
         <template #title>
            <h1 class="text-2xl">ยืนยันการแจ้งปัญหา</h1>
        </template>
        <template #content>
           <p>ยืนยันการแจ้งปัญหาใช่หรือไม่</p>
        </template>
        <template #action>
          <button @click="submitForm" type="button" class="btn btn-primary">ยืนยัน</button>
        </template>
        </Modal>
        <button @click="openModal" type="submit" class="btn btn-primary w-3/4 sm:w-1/4 mx-auto block">ยืนยัน</button>
      </div>
    </form>
  </div>
  <Alert :is-open="isAlertOpen" :status="alertStatus"  @close="closeAlert" :message="alertMessage"/>
</template>

<script setup>

const form = reactive({
  title: '',
  detail: '',
  category: '',
  recipient: '',
  files: []
})

const ModalState = ref(null);
const isAlertOpen = ref(false);
const alertStatus = ref('success');
const alertMessage = ref('');

// เปิด Modal
const openModal = () => {
  ModalState.value = true;
}

const handleFileUpload = (event) => {
  const newFiles = Array.from(event.target.files)
  newFiles.forEach(file => {
    const fileObject = {
      file: file,
      name: file.name,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }
    form.files.push(fileObject)
  })
}

const removeFile = (index) => {
  if (form.files[index].preview) {
    URL.revokeObjectURL(form.files[index].preview)
  }
  form.files.splice(index, 1)
  
}

const submitForm = async () => {
  try {
    // Simulate an API call
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve();
        } else {
          reject(new Error('Submission failed'));
        }
      }, 1000);
    });

    console.log('Form submitted:', {
      ...form,
      files: form.files.map(f => f.file)
    });
    
    // Reset form fields
    form.title = '';
    form.detail = '';
    form.category = '';
    form.recipient = '';
    form.files.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    form.files = [];

    // Show success alert
    showAlert('success', 'แจ้งปัญหา');
  } catch (error) {
    // Show error alert
    showAlert('error', 'แจ้งปัญหา');
  } finally {
    // Close the modal
    ModalState.value = false;
  }
}

const showAlert = (status, message) => {
  alertStatus.value = status;
  alertMessage.value = message;
  isAlertOpen.value = true;
  
  // Automatically close the alert after 3 seconds
  setTimeout(closeAlert, 3000);
}

const closeAlert = () => {
  isAlertOpen.value = false;
}

</script>