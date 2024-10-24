<template>
    <div class="container mx-auto w-4/5 mb-4">
        <div class="bg-base-200 collapse">
  <input type="checkbox" class="peer" />
  <div
    class="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
    Click me to show/hide content
  </div>
  <div
    class="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
    <div>
        <input type="text" placeholder="Search..." class="input input-bordered w-full" />
    </div>
  </div>
</div>

    </div>
    <div class="card p-4 mx-auto w-4/5 bg-primary min-h-screen h-auto">
        <table>
            <thead>
                <tr>
                    <th>ลําดับ</th>
                    <th>ประเภท</th>
                    <th>เรื่อง</th>
                    <th>รายละเอียด</th>
                    <th>วันที่</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>HardWare</td>
                    <td>ระบบคอมพิวเตอร์</td>
                    <td>เครื่องคอมพิวเตอร์เกิดปัญหา</td>
                    <td>2022-01-01</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
